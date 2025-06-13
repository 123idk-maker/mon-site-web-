document.addEventListener('DOMContentLoaded', () => {
    // Navigation mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Animation des liens
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Animation du burger
        burger.classList.toggle('toggle');
    });

    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nom: document.getElementById('nom').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Message envoyé avec succès !');
                contactForm.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            alert('Erreur : ' + error.message);
        }
    });

    // Chargement des projets
    const loadProjets = async () => {
        try {
            const response = await fetch('/api/projets');
            const projets = await response.json();
            
            const container = document.getElementById('projects-container');
            
            projets.forEach(projet => {
                const projetElement = document.createElement('div');
                projetElement.className = 'project-card';
                
                projetElement.innerHTML = `
                    <img src="${projet.image_url || 'https://via.placeholder.com/300x200'}" alt="${projet.titre}" class="project-image">
                    <div class="project-info">
                        <h3>${projet.titre}</h3>
                        <p>${projet.description}</p>
                        <p class="technologies">${projet.technologies}</p>
                        <div class="project-links">
                            ${projet.lien_github ? `<a href="${projet.lien_github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                            ${projet.lien_demo ? `<a href="${projet.lien_demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                        </div>
                    </div>
                `;
                
                container.appendChild(projetElement);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des projets:', error);
        }
    };

    loadProjets();
});
