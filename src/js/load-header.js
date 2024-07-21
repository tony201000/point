document.addEventListener('DOMContentLoaded', function() {
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Ajoutez la classe 'active' au lien de navigation correspondant à la page courante
            const currentPage = window.location.pathname.split("/").pop();
            const navLinks = document.querySelectorAll('.main-nav a');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => console.error('Erreur lors du chargement du header:', error));
}); 