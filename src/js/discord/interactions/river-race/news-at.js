const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../../res/values/colors");
const {sendFollowUp} = require("../response");
const reportRepository = require("../../../database/repository/report-repository");
const {Report} = require("../../../database/model/report");

function autocompleteReceiveRiverRaceNewsAt(interaction, client) {
    const keyword = interaction.options.getString('time')

    const minutes = [
        '00',
        '15',
        '30',
        '45'
    ]

    const hours = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
    ]

    const elements = []
    hours.forEach(hour => {
        minutes.forEach(minutes => {
            const time24H = `${hour}:${minutes}`
            if (parseInt(hour) >= 12) {
                const time12H = `${parseInt(hour) === 0 ? 12 : parseInt(hour) / 2}:${minutes} PM`
                const autocompleteTime = {
                    name: `at ${time24H} (${time12H})`,
                    value: `${hour}:${minutes}`
                }
                elements.push(autocompleteTime)
            } else {
                const time12H = `${parseInt(hour) === 0 ? 12 : hour}:${minutes} AM`
                const autocompleteTime = {
                    name: `at ${time24H} (${time12H})`,
                    value: `${hour}:${minutes}`
                }
                elements.push(autocompleteTime)
            }
        })
    })


    interaction.respond(elements.filter(el => {
        return el.name.includes(keyword)
    }).slice(0, 25))
}

function commandReceiveRiverRaceNewsAt(interaction, client) {
    const guildId = interaction.guild.id
    const time = interaction.options.getString('time').split(':')
    const hour = parseInt(time[0])
    const minutes = parseInt(time[1])
    if (hour >= 0 && hour <= 23 && (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45)) {
        reportRepository.insertReport(Report.forRiverRace(
            guildId,
            hour,
            minutes
        ))
        const response = {
            embeds: [
                new MessageEmbed()
                    .setDescription(`Daily river-race news will be received at \`${hour}:${minutes}\``)
                    .setColor(ColorsValues.colorBotGreen)
            ]
        }
        sendFollowUp(interaction, response)
    } else {
        const response = {
            embeds: [
                new MessageEmbed()
                    .setDescription(`Invalid time format. Please input the time in the 24 hours format.\nThe supported minutes for the time being are \`0\`, \`15\`, \`30\`, \`45\`.\nThe supported time format is \`hh:mm\``)
                    .setColor(ColorsValues.colorBotRed)
            ]
        }
        sendFollowUp(interaction, response)
    }
}

function autocompleteCancelRiverRaceNewsAt(interaction, client) {
    const keyword = interaction.options.getString('time')
    const guildId = interaction.guild.id

    reportRepository.getReports(Report.forRiverRace(guildId)).then(reports => {
        const elements = []
        reports.forEach(report => {
            const {
                hours,
                minutes
            } = report
            const time24H = `${hours}:${minutes}`
            if (parseInt(hours) >= 12) {
                const time12H = `${parseInt(hours) === 0 ? 12 : parseInt(hours) / 2}:${minutes} PM`
                const autocompleteTime = {
                    name: `at ${time24H} (${time12H})`,
                    value: `${hours}:${minutes}`
                }
                elements.push(autocompleteTime)
            } else {
                const time12H = `${parseInt(hours) === 0 ? 12 : hours}:${minutes} AM`
                const autocompleteTime = {
                    name: `at ${time24H} (${time12H})`,
                    value: `${hours}:${minutes}`
                }
                elements.push(autocompleteTime)
            }
        })
        interaction.respond(elements.filter(el => {
            return el.name.includes(keyword)
        }).slice(0, 25))
    })

}

function commandCancelRiverRaceNewsAt(interaction, client) {
    const guildId = interaction.guild.id
    const time = interaction.options.getString('time').split(':')
    const hours = parseInt(time[0])
    const minutes = parseInt(time[1])
    if (hours >= 0 && hours <= 23 && (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45)) {
        reportRepository.deleteReport(Report.forRiverRace(
            guildId,
            hours,
            minutes
        ))
        const response = {
            embeds: [
                new MessageEmbed()
                    .setDescription(`Daily river-race news will not be received anymore at \`${hours}:${minutes}\``)
                    .setColor(ColorsValues.colorBotGreen)
            ]
        }
        sendFollowUp(interaction, response)
    } else {
        const response = {
            embeds: [
                new MessageEmbed()
                    .setDescription(`Invalid time format. Please input the time in the 24 hours format.\nThe supported minutes for the time being are \`0\`, \`15\`, \`30\`, \`45\`.\nThe supported time format is \`hh:mm\``)
                    .setColor(ColorsValues.colorBotRed)
            ]
        }
        sendFollowUp(interaction, response)
    }
}

module.exports = {
    autocompleteReceiveRiverRaceNewsAt,
    commandReceiveRiverRaceNewsAt,
    autocompleteCancelRiverRaceNewsAt,
    commandCancelRiverRaceNewsAt
}