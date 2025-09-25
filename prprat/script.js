// Estado da aplicação
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// Elementos DOM
const screens = {
    home: document.getElementById('home-screen'),
    register: document.getElementById('register-screen'),
    login: document.getElementById('login-screen'),
    edit: document.getElementById('edit-screen')
};

// Funções de navegação
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Funções de utilidade
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function findUser(email) {
    return users.find(user => user.email === email);
}

function showAlert(message, type = 'info') {
    alert(message);
}

// Event Listeners para navegação
document.getElementById('login-btn').addEventListener('click', () => {
    showScreen('login');
});

document.getElementById('register-btn').addEventListener('click', () => {
    showScreen('register');
});

document.getElementById('back-to-home-from-register').addEventListener('click', () => {
    showScreen('home');
});

document.getElementById('back-to-home-from-login').addEventListener('click', () => {
    showScreen('home');
});

// Cadastro de usuário
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Verificar se email já existe
    if (findUser(userData.email)) {
        showAlert('Este email já está cadastrado!');
        return;
    }
    
    // Adicionar usuário
    users.push(userData);
    saveUsers();
    
    showAlert('Usuário cadastrado com sucesso!');
    e.target.reset();
    showScreen('home');
});

// Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const user = findUser(email);
    
    if (!user || user.password !== password) {
        showAlert('Email ou senha incorretos!');
        return;
    }
    
    currentUser = user;
    showAlert(`Bem-vindo, ${user.name}!`);
    
    // Preencher formulário de edição
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-password').value = '';
    
    e.target.reset();
    showScreen('edit');
});

// Edição de usuário
document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const formData = new FormData(e.target);
    const newName = formData.get('name');
    const newEmail = formData.get('email');
    const newPassword = formData.get('password');
    
    // Verificar se o novo email já existe (exceto o próprio usuário)
    const existingUser = findUser(newEmail);
    if (existingUser && existingUser !== currentUser) {
        showAlert('Este email já está sendo usado por outro usuário!');
        return;
    }
    
    // Atualizar dados do usuário
    currentUser.name = newName;
    currentUser.email = newEmail;
    if (newPassword) {
        currentUser.password = newPassword;
    }
    
    saveUsers();
    showAlert('Dados atualizados com sucesso!');
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    currentUser = null;
    showAlert('Logout realizado com sucesso!');
    showScreen('home');
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    showScreen('home');
});