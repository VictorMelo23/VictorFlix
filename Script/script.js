// Netflix Clone JavaScript

// Dados dos filmes e séries
const moviesData = {
    'Lucifer': {
        title: 'Lucifer',
        description: 'Drama sobrenatural sobre o próprio Diabo que se muda para Los Angeles.',
        image: 'images/lucifer.jpg',
        type: 'serie'
    },
    'Sex Education': {
        title: 'Sex Education',
        description: 'Comédia dramática sobre adolescentes navegando pela sexualidade.',
        image: 'images/sex_education.jpg',
        type: 'serie'
    },
    'The 100': {
        title: 'The 100',
        description: 'Ficção científica pós-apocalíptica sobre sobreviventes na Terra.',
        image: 'images/the_100.jpg',
        type: 'serie'
    },
    'The Umbrella Academy': {
        title: 'The Umbrella Academy',
        description: 'Super-heróis disfuncionais se reúnem para salvar o mundo.',
        image: 'images/umbrella_academy.jpg',
        type: 'serie'
    }
};

// Gerenciamento da lista pessoal
class MyListManager {
    constructor() {
        this.myList = JSON.parse(localStorage.getItem('netflixMyList')) || [];
        this.init();
    }

    init() {
        this.addEventListeners();
        this.updateMyListPage();
    }

    addEventListeners() {
        // Adicionar botões de "Adicionar à Lista" em todos os cards
        document.addEventListener('DOMContentLoaded', () => {
            this.addListButtons();
        });

        // Event listener para cliques nos cards
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-list-btn')) {
                const title = e.target.getAttribute('data-title');
                this.toggleFromList(title);
            }
        });
    }

    addListButtons() {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            const title = card.getAttribute('data-title');
            if (title && moviesData[title]) {
                const isInList = this.myList.includes(title);
                const button = document.createElement('button');
                button.className = 'add-to-list-btn';
                button.setAttribute('data-title', title);
                button.innerHTML = isInList ? '✓ Na Lista' : '+ Minha Lista';
                button.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: rgba(0,0,0,0.8);
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background-color 0.3s ease;
                `;
                
                // Adicionar posição relativa ao card
                card.style.position = 'relative';
                card.appendChild(button);

                // Hover effect
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = '#e50914';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = 'rgba(0,0,0,0.8)';
                });
            }
        });
    }

    toggleFromList(title) {
        const index = this.myList.indexOf(title);
        if (index > -1) {
            this.myList.splice(index, 1);
        } else {
            this.myList.push(title);
        }
        
        localStorage.setItem('netflixMyList', JSON.stringify(this.myList));
        this.updateListButtons();
        this.updateMyListPage();
        
        // Mostrar notificação
        this.showNotification(title, index > -1 ? 'removido' : 'adicionado');
    }

    updateListButtons() {
        const buttons = document.querySelectorAll('.add-to-list-btn');
        buttons.forEach(button => {
            const title = button.getAttribute('data-title');
            const isInList = this.myList.includes(title);
            button.innerHTML = isInList ? '✓ Na Lista' : '+ Minha Lista';
        });
    }

    updateMyListPage() {
        const emptyListDiv = document.getElementById('my-list-content');
        const savedItemsDiv = document.getElementById('saved-items');
        
        if (!emptyListDiv || !savedItemsDiv) return;

        if (this.myList.length === 0) {
            emptyListDiv.style.display = 'block';
            savedItemsDiv.style.display = 'none';
        } else {
            emptyListDiv.style.display = 'none';
            savedItemsDiv.style.display = 'grid';
            
            savedItemsDiv.innerHTML = '';
            this.myList.forEach(title => {
                if (moviesData[title]) {
                    const movieCard = this.createMovieCard(moviesData[title]);
                    savedItemsDiv.appendChild(movieCard);
                }
            });
        }
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-title', movie.title);
        card.style.position = 'relative';
        
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <div class="movie-card-content">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
            </div>
            <button class="remove-from-list-btn" data-title="${movie.title}" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: rgba(229, 9, 20, 0.9);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
            ">✕ Remover</button>
        `;

        // Event listener para remover
        const removeBtn = card.querySelector('.remove-from-list-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFromList(movie.title);
        });

        return card;
    }

    showNotification(title, action) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #e50914;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        notification.textContent = `"${title}" foi ${action} ${action === 'adicionado' ? 'à' : 'da'} sua lista`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Gerenciamento do perfil
class ProfileManager {
    constructor() {
        this.profileData = JSON.parse(localStorage.getItem('netflixProfile')) || {
            name: 'Usuário',
            email: 'usuario@email.com',
            phone: '',
            birthDate: '',
            language: 'pt-br',
            quality: 'auto'
        };
        this.init();
    }

    init() {
        this.loadProfileData();
        this.addEventListeners();
    }

    loadProfileData() {
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const birthDateField = document.getElementById('birth-date');
        const languageField = document.getElementById('language');
        const qualityField = document.getElementById('quality');
        const profileName = document.getElementById('profile-name');
        const avatarInitial = document.getElementById('avatar-initial');

        if (nameField) nameField.value = this.profileData.name;
        if (emailField) emailField.value = this.profileData.email;
        if (phoneField) phoneField.value = this.profileData.phone;
        if (birthDateField) birthDateField.value = this.profileData.birthDate;
        if (languageField) languageField.value = this.profileData.language;
        if (qualityField) qualityField.value = this.profileData.quality;
        if (profileName) profileName.textContent = this.profileData.name;
        if (avatarInitial) avatarInitial.textContent = this.profileData.name.charAt(0).toUpperCase();
    }

    addEventListeners() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }
    }

    saveProfile() {
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const birthDateField = document.getElementById('birth-date');

        if (nameField) this.profileData.name = nameField.value;
        if (emailField) this.profileData.email = emailField.value;
        if (phoneField) this.profileData.phone = phoneField.value;
        if (birthDateField) this.profileData.birthDate = birthDateField.value;

        localStorage.setItem('netflixProfile', JSON.stringify(this.profileData));
        this.loadProfileData();
        this.showNotification('Perfil atualizado com sucesso!');
    }

    savePreferences() {
        const languageField = document.getElementById('language');
        const qualityField = document.getElementById('quality');

        if (languageField) this.profileData.language = languageField.value;
        if (qualityField) this.profileData.quality = qualityField.value;

        localStorage.setItem('netflixProfile', JSON.stringify(this.profileData));
        this.showNotification('Preferências salvas com sucesso!');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Função global para salvar preferências (chamada pelo HTML)
function savePreferences() {
    if (window.profileManager) {
        window.profileManager.savePreferences();
    }
}

// Efeitos visuais e interações
class UIEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addScrollEffect();
        this.addCardHoverEffects();
    }

    addScrollEffect() {
        let lastScrollTop = 0;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            // Change header background opacity based on scroll
            if (scrollTop > 50) {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            } else {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    addCardHoverEffects() {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) translateY(-10px)';
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) translateY(0)';
                card.style.zIndex = '1';
            });
        });
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar gerenciadores
    window.myListManager = new MyListManager();
    window.profileManager = new ProfileManager();
    window.uiEffects = new UIEffects();
    
    // Adicionar classe ativa ao link da página atual
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.color = '#e50914';
        }
    });
});

// Função para simular reprodução de vídeo
function playVideo(title) {
    alert(`Reproduzindo: ${title}\n\nEsta é uma demonstração. Em um site real, isso abriria o player de vídeo.`);
}

// Adicionar event listeners para reprodução nos cards
document.addEventListener('click', (e) => {
    if (e.target.closest('.movie-card') && !e.target.classList.contains('add-to-list-btn') && !e.target.classList.contains('remove-from-list-btn')) {
        const card = e.target.closest('.movie-card');
        const title = card.getAttribute('data-title');
        if (title) {
            playVideo(title);
        }
    }
});

