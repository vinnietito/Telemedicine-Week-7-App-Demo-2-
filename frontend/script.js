// frontend/script.js

document.getElementById('addDoctorForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const doctorData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      specialization: document.getElementById('specialization').value,
      availability: document.getElementById('availability').value
    };
  
   await fetch('/admin/add-doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Use JWT for admin authentication
      },
      body: JSON.stringify(doctorData)
    })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(error => console.error('Error:', error));
  });
  
  document.getElementById('viewPatientsBtn').addEventListener('click', async function () {
    await fetch('/admin/patients', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(patients => {
        const table = document.getElementById('patientsTable');
        table.style.display = 'table';
        
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing data
  
        patients.forEach(patient => {
          const row = `<tr>
            <td>${patient.id}</td>
            <td>${patient.first_name}</td>
            <td>${patient.last_name}</td>
            <td>${patient.email}</td>
          </tr>`;
          tbody.innerHTML += row;
        });
      })
      .catch(error => console.error('Error:', error));
  });
  