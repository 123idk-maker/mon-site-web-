document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    });
});
