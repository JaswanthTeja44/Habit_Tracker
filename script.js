    const habitForm = document.getElementById('habitForm');
    const habitNameInput = document.getElementById('habitName');
    const daysInput = document.getElementById('days');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const habitList = document.getElementById('habitList');
    const errorMsg = document.getElementById('errorMsg');
    const livePreview = document.getElementById('livePreview');

    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    function renderHabits() {
      habitList.innerHTML = '';
      habits.forEach((habit, index) => {
        const habitDiv = document.createElement('div');
        habitDiv.className = 'habit';

        const today = new Date().toDateString();
        const loggedToday = habit.logs.includes(today);

        habitDiv.innerHTML = `
          <h3>${habit.name}</h3>
          <p>Repeat: ${habit.days.join(', ')}</p>
          <p>Time: ${habit.start} - ${habit.end}</p>
          <p>Streak: <span class="streak">${habit.streak}</span> days</p>
          <button class="log-button" ${loggedToday ? 'disabled' : ''} onclick="logHabit(${index})">
            ${loggedToday ? 'Logged Today' : 'Log Today'}
          </button>
        `;

        habitList.appendChild(habitDiv);
      });
    }

    function logHabit(index) {
      const today = new Date().toDateString();
      if (!habits[index].logs.includes(today)) {
        const lastLogged = habits[index].logs[habits[index].logs.length - 1];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLogged === yesterday.toDateString()) {
          habits[index].streak++;
        } else {
          habits[index].streak = 1;
        }

        habits[index].logs.push(today);
        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits();
      }
    }

    habitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const habitName = habitNameInput.value.trim();
      const selectedDays = Array.from(daysInput.selectedOptions).map(opt => opt.value);
      const startTime = startTimeInput.value;
      const endTime = endTimeInput.value;

      if (!habitName) {
        errorMsg.textContent = 'Habit name cannot be empty.';
        return;
      }

      if (!selectedDays.length) {
        errorMsg.textContent = 'Select at least one repeat day.';
        return;
      }

      if (habits.some(habit => habit.name.toLowerCase() === habitName.toLowerCase())) {
        errorMsg.textContent = 'This habit already exists.';
        return;
      }

      errorMsg.textContent = '';

      habits.push({
        name: habitName,
        days: selectedDays,
        start: startTime || 'Not set',
        end: endTime || 'Not set',
        logs: [],
        streak: 0
      });

      localStorage.setItem('habits', JSON.stringify(habits));
      habitNameInput.value = '';
      daysInput.selectedIndex = -1;
      startTimeInput.value = '';
      endTimeInput.value = '';
      livePreview.innerHTML = '<p>Fill in the form to see a preview...</p>';
      renderHabits();
    });

    [habitNameInput, daysInput, startTimeInput, endTimeInput].forEach(input => {
      input.addEventListener('input', () => {
        const habitName = habitNameInput.value.trim();
        const selectedDays = Array.from(daysInput.selectedOptions).map(opt => opt.value);
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        if (habitName || selectedDays.length || startTime || endTime) {
          livePreview.innerHTML = `
            <p><strong>Name:</strong> ${habitName || '...'}</p>
            <p><strong>Days:</strong> ${selectedDays.length ? selectedDays.join(', ') : '...'}</p>
            <p><strong>Time:</strong> ${startTime || '--:--'} - ${endTime || '--:--'}</p>
          `;
        } else {
          livePreview.innerHTML = '<p>Fill in the form to see a preview...</p>';
        }
      });
    });

    renderHabits();
