// Dynamic Leaderboard content
const leaderboardTitle = document.getElementById("leaderboard-title");
const leaderboardBox = document.querySelector(".leaderboard");

// Simulate fetching leaderboard data
const leaderboardData = [
  { name: "Player1", rank: 1 },
  { name: "Player2", rank: 2 },
  { name: "Player3", rank: 3 },
];

// Populate leaderboard
leaderboardBox.innerHTML = `<ul class="text-white">
  ${leaderboardData
    .map((player) => `<li>${player.rank}. ${player.name}</li>`)
    .join("")}
</ul>`;