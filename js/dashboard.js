// dashboard.js
// Maneja la navegación entre vistas sin recargar la página.
// "viewId" corresponde al id de las secciones <section id="...">

(function () {
    const VIEW_CLASS = 'view';
    const ACTIVE_CLASS = 'active';
    let chartsInitialized = false;

    function hideAllViews() {
        document.querySelectorAll('.' + VIEW_CLASS).forEach(v => {
            v.classList.remove(ACTIVE_CLASS);
        });
    }

    function clearActiveMenu() {
        document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove(ACTIVE_CLASS));
    }

    function showView(viewId) {
        // esconder todas
        hideAllViews();

        // mostrar la solicitada
        const target = document.getElementById(viewId);
        if (!target) return;

        target.classList.add(ACTIVE_CLASS);

        // activar item del sidebar si existe
        const sidebarLink = document.querySelector('.sidebar-menu a[data-view="' + viewId + '"]');
        clearActiveMenu();
        if (sidebarLink && sidebarLink.parentElement) {
            sidebarLink.parentElement.classList.add(ACTIVE_CLASS);
        }

        // activar icon-box correspondiente (si existe)
        document.querySelectorAll('.icons-grid .icon-box').forEach(box => box.classList.remove(ACTIVE_CLASS));
        const iconBox = document.querySelector('.icons-grid .icon-box[data-view="' + viewId + '"]');
        if (iconBox) iconBox.classList.add(ACTIVE_CLASS);

        // inicializar gráficos solo cuando muestra el dashboard (y solo una vez)
        if (viewId === 'dashboard' && !chartsInitialized) {
            initCharts();
            chartsInitialized = true;
        }
    }

    // Inicializa listeners en menú lateral y en los icon-box
    function initNavigation() {
        // Sidebar links
        document.querySelectorAll('.sidebar-menu a[data-view]').forEach(a => {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const view = this.getAttribute('data-view');
                showView(view);
                // actualizar URL sin recargar (opcional)
                history.replaceState(null, '', '#' + view);
            });
        });

        // Icon boxes (módulos)
        document.querySelectorAll('.icons-grid .icon-box[data-view]').forEach(box => {
            box.style.cursor = 'pointer';
            box.addEventListener('click', function () {
                const view = this.getAttribute('data-view');
                showView(view);
                history.replaceState(null, '', '#' + view);
                // desplazar al tope del main
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Si el usuario entra con hash en URL, mostrar esa vista
        const hash = location.hash.replace('#', '');
        if (hash) {
            showView(hash);
        } else {
            showView('dashboard'); // vista por defecto
        }
    }

    // Función para crear gráficos con Chart.js en el Dashboard
    function initCharts() {
        // BARRAS
        const barCtx = document.getElementById('barChart');
        if (barCtx) {
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ["Pastel Italiano", "Azúcar Granulada", "Capturadora Video 1080p"],
                    datasets: [{
                        label: "Cantidad",
                        data: [90, 30, 113],
                        backgroundColor: ["#1d72aa", "#f8a300", "#6610f2"]
                    }]
                },
                options: { responsive: true }
            });
        }

        // PIEs
        const pie1 = document.getElementById('pie1');
        if (pie1) {
            new Chart(pie1, {
                type: 'doughnut',
                data: {
                    labels: ["Teclado", "Mouse", "Monitor"],
                    datasets: [{ data: [125, 105, 50] }]
                }
            });
        }

        const pie2 = document.getElementById('pie2');
        if (pie2) {
            new Chart(pie2, {
                type: 'doughnut',
                data: {
                    labels: ["Entradas", "Salidas", "Pedidos", "Compras"],
                    datasets: [{ data: [3, 12, 9, 2] }]
                }
            });
        }

        const pie3 = document.getElementById('pie3');
        if (pie3) {
            new Chart(pie3, {
                type: 'doughnut',
                data: {
                    labels: ["Impresora", "PC de escritorio", "Notebook"],
                    datasets: [{ data: [22, 12, 8] }]
                }
            });
        }
    }

    // Inicialización al cargar el DOM
    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
    });


})();
