let subjects = [];

function openAddSubjectModal() {
    document.getElementById('addSubjectModal').classList.remove('hidden');
}

function closeAddSubjectModal() {
    document.getElementById('addSubjectModal').classList.add('hidden');
    document.getElementById('addSubjectForm').reset();
}

function calculateAttendance(attended, total) {
    if (total === 0) return 0;
    return (attended / total) * 100;
}

function calculateClassesToAttend(attended, total, target) {
    if (total === 0) return 0;
    const targetDecimal = target / 100;
    const requiredClasses = Math.ceil((targetDecimal * total - attended) / (1 - targetDecimal));
    return Math.max(0, requiredClasses);
}

function calculateClassesToBunk(attended, total, target) {
    if (total === 0) return 0;
    const targetDecimal = target / 100;
    const maxAbsences = Math.floor(attended / targetDecimal - total);
    return Math.max(0, maxAbsences);
}

function handleAddSubject(event) {
    event.preventDefault();
    const name = document.getElementById('subjectName').value;
    const attended = parseInt(document.getElementById('classesAttended').value) || 0;
    let total = parseInt(document.getElementById('totalClasses').value);
    
    // If total is not provided or less than attended, set it equal to attended
    total = (!total || total < attended) ? attended : total;

    subjects.push({ name, attended, total });
    updateSubjectDisplay();
    saveToLocalStorage();
    closeAddSubjectModal();
}

function markAttendance(index, isPresent) {
    if (isPresent) {
        subjects[index].attended++;
    }
    
    // Always ensure total is at least equal to attended
    if (subjects[index].total === 0 || subjects[index].total < subjects[index].attended) {
        subjects[index].total = subjects[index].attended;
    } else {
        subjects[index].total++;
    }

    updateSubjectDisplay();
    saveToLocalStorage();
}

function updateSubjectDisplay() {
    const subjectList = document.getElementById('subjectList');
    const target = parseFloat(document.getElementById('targetPercentage').value);
    subjectList.innerHTML = '';
    
    subjects.forEach((subject, index) => {
        const attendance = calculateAttendance(subject.attended, subject.total);
        const classesNeeded = calculateClassesToAttend(subject.attended, subject.total, target);
        const classesToBunk = calculateClassesToBunk(subject.attended, subject.total, target);

        const subjectElement = document.createElement('div');
        subjectElement.className = 'bg-white p-4 rounded-lg shadow';
        subjectElement.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                <h3 class="font-semibold text-lg">${subject.name}</h3>
                <div class="space-x-2">
                    <button onclick="markAttendance(${index}, true)" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Present</button>
                    <button onclick="markAttendance(${index}, false)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Absent</button>
                    <button onclick="deleteSubject(${index})" class="text-red-500 hover:text-red-600">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Attendance: ${attendance.toFixed(1)}%</span>
                    <span>Classes Attended: ${subject.attended}/${subject.total}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-500 h-2.5 rounded-full transition-all" style="width: ${Math.min(100, attendance)}%"></div>
                </div>
                <div class="text-sm space-y-1">
                    <p class="${attendance >= target ? 'text-green-600' : 'text-red-600'}">
                        ${classesNeeded === 0 
                            ? 'Target attendance achieved!' 
                            : `Need to attend ${classesNeeded} more classes to reach target`}
                    </p>
                    <p class="text-blue-600">
                        ${classesToBunk > 0 
                            ? `You can skip ${classesToBunk} classes while maintaining target attendance` 
                            : 'Cannot skip any classes at the moment'}
                    </p>
                </div>
            </div>
        `;
        subjectList.appendChild(subjectElement);
    });
}

function deleteSubject(index) {
    if (confirm('Are you sure you want to delete this subject?')) {
        subjects.splice(index, 1);
        updateSubjectDisplay();
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('targetPercentage', document.getElementById('targetPercentage').value);
}

function loadFromLocalStorage() {
    const savedSubjects = localStorage.getItem('subjects');
    const savedTarget = localStorage.getItem('targetPercentage');
    
    if (savedSubjects) {
        subjects = JSON.parse(savedSubjects);
        updateSubjectDisplay();
    }
    
    if (savedTarget) {
        document.getElementById('targetPercentage').value = savedTarget;
    }
}

// Event Listeners
document.getElementById('targetPercentage').addEventListener('change', () => {
    updateSubjectDisplay();
    saveToLocalStorage();
});

// Initial load
loadFromLocalStorage();
