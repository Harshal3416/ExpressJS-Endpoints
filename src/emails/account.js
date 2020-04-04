// npm i @sendgrid/mail
const sgMail = require('@sendgrid/mail')

// const sendGridApiKey = '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'

sgMail.setApiKey(process.env.SENDGRIP_API_KEY)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'harshalbelamkar5@gmail.com',
        subject: 'Welcome Message',
        text: `Welcome to the application ${name}`
        
    })
}

const sendCancelEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'harshalbelamkar5@gmail.com',
        subject: 'Cancellation Message',
        text: `Bye ${name}`
        
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}