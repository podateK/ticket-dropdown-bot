const {
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

// Mapa wartości do ID kategorii
const categoryMap = {
  partnership: "1219752557057147002",
  complaint: "1219752645883986021",
  recruitment: "1219752457371123732",
  // Dodaj więcej opcji tutaj
};

async function createChannelAndSendMsg(
  interaction,
  category,
  staffRole,
  row,
  title,
  description
) {
  const channel = await interaction.guild.channels.create(
    `ticket from ${interaction.user.username}`,
    {
      type: "GUILD_TEXT",
      topic: `${interaction.user.id}`,
      parent: `${category}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: interaction.user.id,
          allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: staffRole,
          allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
      ],
    }
  );

  const embed = new MessageEmbed().setTitle(title).setDescription(description);

  await channel.send({
    embeds: [embed],
    content: `${staffRole} | ${interaction.user}`,
    components: [row],
  });

  await interaction.reply({
    content: `<:2003on:912015084405014558> Your ticket has been successfully opened. <#${channel.id}>`,
    ephemeral: true,
  });
}

module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (!interaction.isSelectMenu()) return;

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("del")
        .setPlaceholder("Select to delete the ticket!")
        .addOptions([
          {
            label: "🗑️ Delete the ticket",
            description: "Delete the channel",
            value: "delete",
          },
        ])
    );

    let staffRole = interaction.guild.roles.cache.get("1219740884606648342");

    let AlreadyAChannel = interaction.guild.channels.cache.find(
      (c) => c.topic == interaction.user.id
    );

    if (interaction.customId === "del") {
      if (interaction.values[0] == "delete") {
        const channel = interaction.channel;
        channel.delete();
      }
    }

    if (interaction.customId == "select") {
      if (AlreadyAChannel)
        return interaction.reply({
          content:
            "<:4247off:912015084035907665> You already have an open ticket on the server.",
          ephemeral: true,
        });

      // Pobierz ID kategorii na podstawie wybranej opcji
      const category = categoryMap[interaction.values[0]];

      let title, description;
      if (interaction.values[0] == "partnership") {
        title = "Ticket to apply for recruitment";
        description =
          "Please detail your application so that a server moderator will come to take charge.";
      } else if (interaction.values[0] == "complaint") {
        title = "Ticket to file a complaint";
        description =
          "Please detailt what you want to buy so that a server moderator will come to take charge.";
      } else if (interaction.values[0] == "recruitment") {
        title = "Ticket to ask a question";
        description =
          "Please detail your question so that a server moderator will come to take charge.";
      }

      if (title && description) {
        await createChannelAndSendMsg(
          interaction,
          category,
          staffRole,
          row,
          title,
          description
        );
      }
    }
  },
};
