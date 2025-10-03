document.addEventListener('DOMContentLoaded', () => {
    // Pega a data de hoje e zera as horas para comparar apenas os dias
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Seleciona todas as seções de semana
    const weekSections = document.querySelectorAll('.button-column');
    const container = document.querySelector('.columns-container');

    weekSections.forEach(section => {
        const timeTags = section.querySelectorAll('time');
        // Garante que temos as duas tags de data (início e fim)
        if (timeTags.length < 2) {
            return;
        }

        const startDateAttr = timeTags[0].getAttribute('datetime');
        const endDateAttr = timeTags[1].getAttribute('datetime');

        if (!startDateAttr || !endDateAttr) {
            return;
        }

        // Converte as strings de data (YYYY-MM-DD) para objetos Date
        // O -1 no mês é porque os meses em JS são de 0 a 11
        const startParts = startDateAttr.split('-');
        const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);

        const endParts = endDateAttr.split('-');
        const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);

        // Compara as datas e adiciona as classes CSS
        if (today >= startDate && today <= endDate) {
            section.classList.add('current-week');

            // Move a coluna da semana atual para ser a primeira
            if (container) {
                container.prepend(section);
            }

            // Faz a página rolar suavemente para a semana atual
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else if (today > endDate) {
            section.classList.add('past-week');
        }
    });

    // --- Lógica para o botão "Voltar ao Topo" ---
    const backToTopButton = document.getElementById("back-to-top");

    if (backToTopButton) {
        // Mostra o botão quando o usuário rola 200px para baixo
        const scrollFunction = () => {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        };

        window.addEventListener("scroll", scrollFunction);

        // Rola para o topo quando o botão é clicado
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lógica para o Seletor de Tema ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const docElement = document.documentElement; // O elemento <html>

    // Função para aplicar o tema e atualizar o ícone do botão
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            docElement.classList.add('dark-mode');
            if (themeToggleButton) themeToggleButton.textContent = '☀️'; // Sol
        } else {
            docElement.classList.remove('dark-mode');
            if (themeToggleButton) themeToggleButton.textContent = '🌙'; // Lua
        }
    };

    // Função para alternar o tema quando o botão é clicado
    const toggleTheme = () => {
        const currentTheme = docElement.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme); // Salva a preferência
        applyTheme(currentTheme);
    };

    // Lógica para carregar o tema na inicialização da página
    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            // 1. Usa o tema salvo se existir
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            // 2. Se não houver tema salvo, usa a preferência do sistema
            applyTheme('dark');
        } else {
            // 3. Padrão para o tema claro
            applyTheme('light');
        }
    };

    // Adiciona o evento de clique ao botão
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Carrega o tema assim que o DOM estiver pronto
    loadTheme();

    // --- Lógica para Animação de Entrada das Colunas ---
    const observerOptions = {
        root: null, // Observa em relação ao viewport
        rootMargin: '0px',
        threshold: 0.1 // Ativa quando 10% do item estiver visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para a observação após a animação
            }
        });
    }, observerOptions);

    // Observa cada coluna de cardápio
    document.querySelectorAll('.button-column').forEach(column => observer.observe(column));
});
