const ctx = document.getElementById('myChart').getContext('2d');

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'],
    datasets: [{
      label: 'Kiválasztott sor adatai',
      data: [],
      borderColor: 'blue',
      backgroundColor: 'lightblue',
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const rows = document.querySelectorAll('#dataTable tbody tr');
rows.forEach(row => {
  row.addEventListener('click', () => {
    const cells = Array.from(row.querySelectorAll('td')).slice(1);
    const values = cells.map(cell => Number(cell.textContent));
    chart.data.datasets[0].data = values;
    chart.update();
  });
});
