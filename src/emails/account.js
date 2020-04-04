const sgMail = require('@sendgrid/mail')

const sendGridApiKey = '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'

sgMail.setApiKey(sendGridApiKey)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'harshalbelamkar5@gmail.com',
        subject: 'Welcome Message',
        text: `Welcome to the application ${name}`
        
    })
}

module.exports = {
    sendWelcomeEmail
}