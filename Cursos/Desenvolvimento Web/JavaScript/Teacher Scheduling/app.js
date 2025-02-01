// Estrutura de dados para armazenar os professores
let teachers = [];
let editingTeacherId = null;

// Dias da semana e horários
const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const timeSlots = ['07:30-08:20', '08:20-09:10', '09:10-10:00', '10:20-11:10', '11:10-12:00'];

// Inicializa a grade de disponibilidade
function initializeAvailabilityGrid() {
    const grid = document.getElementById('availabilityGrid');
    grid.innerHTML = '';

    // Adiciona cabeçalho dos dias
    grid.appendChild(createCell('Horário', 'schedule-header'));
    weekDays.forEach(day => {
        grid.appendChild(createCell(day, 'schedule-header'));
    });

    // Adiciona as células de horários
    timeSlots.forEach(time => {
        grid.appendChild(createCell(time, 'schedule-header'));
        weekDays.forEach(() => {
            const cell = createCell('', 'time-slot available');
            cell.onclick = () => toggleAvailability(cell);
            grid.appendChild(cell);
        });
    });
}

// Cria uma célula para a grade
function createCell(text, className) {
    const cell = document.createElement('div');
    cell.className = className;
    cell.textContent = text;
    return cell;
}

// Alterna disponibilidade da célula
function toggleAvailability(cell) {
    cell.classList.toggle('available');
    cell.classList.toggle('unavailable');
}

// Define a disponibilidade na grade
function setAvailability(availability) {
    const daysCount = weekDays.length + 1; // Inclui cabeçalho dos dias
    timeSlots.forEach((time, timeIndex) => {
        weekDays.forEach((day, dayIndex) => {
            // Cálculo do índice ajustado para restaurar a disponibilidade
            const cellIndex = (timeIndex + 1) * daysCount + (dayIndex + 1);
            const cell = document.getElementById('availabilityGrid').children[cellIndex];
            if (cell) {
                cell.classList.remove('available', 'unavailable');
                if (availability[time] && availability[time][day]) {
                    cell.classList.add('available');
                } else {
                    cell.classList.add('unavailable');
                }
            } else {
                console.error(`Erro ao restaurar a célula em ${time} - ${day}.`);
            }
        });
    });
}

// Salva ou atualiza um professor
function saveTeacher() {
    const name = document.getElementById('teacherName').value;
    const subject = document.getElementById('teacherSubject').value;
    const weeklyHours = parseInt(document.getElementById('teacherHours').value);

    if (!name || !subject || !weeklyHours || weeklyHours <= 0) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    const teacher = {
        id: editingTeacherId || Date.now(),
        name,
        subject,
        weeklyHours,
        availability: getAvailability(),
        allocatedHours: 0
    };

    if (editingTeacherId) {
        const index = teachers.findIndex(t => t.id === editingTeacherId);
        teachers[index] = teacher;
        editingTeacherId = null;
        document.getElementById('saveButton').textContent = 'Cadastrar Professor';
    } else {
        teachers.push(teacher);
    }

    document.getElementById('teacherName').value = '';
    document.getElementById('teacherSubject').value = '';
    document.getElementById('teacherHours').value = '';
    initializeAvailabilityGrid();
    updateTeacherList();
    saveToLocalStorage();
}

// Atualiza a lista de professores
function updateTeacherList() {
    const list = document.getElementById('teacherList');
    list.innerHTML = '<h2>Professores Cadastrados</h2>';

    teachers.forEach(teacher => {
        const item = document.createElement('div');
        item.className = 'teacher-item';
        
        const info = document.createElement('div');
        info.innerHTML = `<strong>${teacher.name}</strong> - ${teacher.subject} (${teacher.weeklyHours} horários)`;
        
        const actions = document.createElement('div');
        
        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = 'Editar';
        editButton.onclick = () => editTeacher(teacher);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteTeacher(teacher.id);

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        
        item.appendChild(info);
        item.appendChild(actions);
        list.appendChild(item);
    });
}

// Edita um professor
function editTeacher(teacher) {
    // Preenche os campos do formulário com os dados do professor
    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('teacherSubject').value = teacher.subject;
    document.getElementById('teacherHours').value = teacher.weeklyHours;

    // Restaura a grade de disponibilidade
    setAvailability(teacher.availability);

    // Salva o ID do professor em edição
    editingTeacherId = teacher.id;

    // Ajusta o texto do botão principal
    document.getElementById('saveButton').textContent = 'Atualizar Professor';

    // Exibe o botão "Cancelar Edição"
    document.getElementById('cancelEditButton').style.display = 'inline-block';
}

// Cancela edição
function cancelEdit() {
    // Limpa os campos do formulário
    document.getElementById('teacherName').value = '';
    document.getElementById('teacherSubject').value = '';
    document.getElementById('teacherHours').value = '';
    
    // Reinicializa a grade de disponibilidade
    initializeAvailabilityGrid();
    
    // Reseta o estado de edição
    editingTeacherId = null;

    // Oculta o botão "Cancelar Edição"
    document.getElementById('cancelEditButton').style.display = 'none';

    // Volta o botão principal para "Cadastrar Professor"
    document.getElementById('saveButton').textContent = 'Cadastrar Professor';
}

// Deleta um professor
function deleteTeacher(id) {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
        teachers = teachers.filter(t => t.id !== id);
        updateTeacherList();
        saveToLocalStorage();
    }
}

// Salva os dados no localStorage
function saveToLocalStorage() {
    localStorage.setItem('teachers', JSON.stringify(teachers));
}

// Carrega os dados do localStorage
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Gera a simulação
function generateSimulation() {
    if (teachers.length === 0) {
        alert('Necessário cadastrar professores!');
        return;
    }

    // Resetar horas alocadas
    teachers.forEach(teacher => teacher.allocatedHours = 0);

    let schedule = {};
    timeSlots.forEach(time => {
        schedule[time] = {};
        weekDays.forEach(day => {
            schedule[time][day] = null;
        });
    });

    // Criar lista de slots disponíveis e embaralhá-los
    let allSlots = [];
    timeSlots.forEach(time => {
        weekDays.forEach(day => {
            const availableTeachers = teachers.filter(teacher => {
                const isAvailable = teacher.availability[time] && teacher.availability[time][day];
                return isAvailable && teacher.allocatedHours < teacher.weeklyHours;
            });

            allSlots.push({ time, day, availableTeachers });
        });
    });

    shuffleArray(allSlots); // Embaralha os slots

    // Processar slots
    allSlots.forEach(slot => {
        const availableTeachers = shuffleArray(slot.availableTeachers.filter(
            teacher => teacher.allocatedHours < teacher.weeklyHours
        ));

        if (availableTeachers.length > 0) {
            const teacher = availableTeachers[0];
            schedule[slot.time][slot.day] = teacher;
            teacher.allocatedHours++;
        }
    });

    // Exibir resultado
    displaySimulation(schedule);

    // Relatório
    let report = 'Relatório de Alocação:\n\n';
    teachers.forEach(teacher => {
        report += `${teacher.name}: ${teacher.allocatedHours} de ${teacher.weeklyHours} horários\n`;
    });
    console.log(report);
}

// Obtém a disponibilidade atual da grade
function getAvailability() {
    const availability = {};
    const daysCount = weekDays.length + 1; // Inclui cabeçalho dos dias
    timeSlots.forEach((time, timeIndex) => {
        availability[time] = {};
        weekDays.forEach((day, dayIndex) => {
            // Cálculo do índice ajustado para considerar cabeçalhos
            const cellIndex = (timeIndex + 1) * daysCount + (dayIndex + 1);
            const cell = document.getElementById('availabilityGrid').children[cellIndex];
            if (cell) {
                availability[time][day] = cell.classList.contains('available');
            } else {
                console.error(`Erro ao acessar a célula em ${time} - ${day}.`);
                availability[time][day] = false; // Valor padrão para evitar inconsistências
            }
        });
    });
    return availability;
}

// Exibe a simulação na interface
function displaySimulation(schedule) {
    const results = document.getElementById('simulationResults');
    results.innerHTML = '<h2 style="margin-top: 5px;">Nova Simulação de Grade Horária</h2>';

    const grid = document.createElement('div');
    grid.className = 'schedule-grid simulation-grid';

    // Adiciona cabeçalho
    grid.appendChild(createCell('Horário', 'schedule-header'));
    weekDays.forEach(day => {
        grid.appendChild(createCell(day, 'schedule-header'));
    });

    // Preenche a grade
    timeSlots.forEach(time => {
        grid.appendChild(createCell(time, 'schedule-header'));
        weekDays.forEach(day => {
            const teacher = schedule[time][day];
            const cellContent = teacher 
                ? `${teacher.name}\n(${teacher.subject})`
                : 'Livre';
            const cellClass = teacher 
                ? 'time-slot occupied-slot'
                : 'time-slot';
            grid.appendChild(createCell(cellContent, cellClass));
        });
    });

    results.appendChild(grid);
}

// Carrega os dados
function loadFromLocalStorage() {
    const saved = localStorage.getItem('teachers');
    if (saved) {
        teachers = JSON.parse(saved);
        updateTeacherList();
    }
}

// Inicialização
window.onload = () => {
    initializeAvailabilityGrid();
    loadFromLocalStorage();
};