const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("isn't this obvious")
    .addUserOption(op => op.setName('member').setDescription("any specific person's pfp you want to see?"))
    .addBooleanOption(bo => bo.setName("server_icon")
      .setDescription("Choose true if you want to see your server pfp, otherwise skip this option")),
  category: 'utility',
  execute(interaction) {
    const member = interaction.options.getMember('member') ?? interaction;
    const bool = interaction.options.getBoolean('server_icon');
    // console.log(bool);

    const av = member.user.displayAvatarURL({ size: 4096, format: 'png', dynamic: true });
    // console.log(member.member.displayAvatarURL());

    const display = (a) => {
      const avatar = new EmbedBuilder().setColor(0xffe83d)
        .setAuthor({
          name: member.user.username, iconURL: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`
        })
        .setImage(a)
      interaction.reply({ embeds: [avatar] })
    }
    if (bool) {
      try {
        const av = member.member.displayAvatarURL({ size: 4096, format: 'png', dynamic: true });
        return display(av)
      } catch (err) {
        // console.log(err)
        return interaction.reply('Poor buddy, go buy nitro first <a:CG_bunny_role_dance:1111244479270223882> ')
      }
    }
    display(av)
  }
}