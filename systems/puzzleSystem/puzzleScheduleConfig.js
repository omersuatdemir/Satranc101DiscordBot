const schedule = require("node-schedule")


const randomHourMin = 12
const randomHourMax = 23


function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// here we configure the occurance rule
function getRule()
{
    let rule = new schedule.RecurrenceRule()
    rule.hour = getRandomInt(randomHourMin, randomHourMax);
    rule.minute = 0
    rule.tz = "Europe/Istanbul"
    return rule
}


exports.getRule = getRule;
