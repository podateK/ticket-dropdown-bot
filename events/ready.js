module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`Zalogowano jako: ${client.user.username}`);
    console.log(`Made by podatekk`);

    var compteurStatus = 1;
    setInterval(async () => {
      status = [`Ticket Bot`];
      compteurStatus = (compteurStatus + 1) % status.length;
      client.user.setPresence({
        activities: [
          {
            name: `${status[compteurStatus]}`,
            type: "WATCHING",
            url: "https://discord.gg/satanc2",
          },
        ],
        status: "online",
      });
    }, 5000);
  },
};
