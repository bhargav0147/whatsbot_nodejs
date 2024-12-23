const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
    sendMessages();
});


async function sendMessage(toNumber, message) {
    const formattedNumber = `91${toNumber}@c.us`; 
    console.log(`Sending message to: ${formattedNumber}`);
    
    try {
        await client.sendMessage(formattedNumber, message);
        console.log(`Message sent to ${toNumber}: ${message}`);
    } catch (error) {
        console.error(`Failed to send message to ${toNumber}:`, error);
    }
}

function sendMessages() {
    fs.readFile('customers.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading customers.json:', err);
            return;
        }
        
        const customers = JSON.parse(data); // Parse the JSON data

       
        customers.forEach((customer) => {
           
            const message = `Hey ${customer.name}, how are you? This is a test message.`;
           
            sendMessage(customer.mobile, message);
        });
    });
}

client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
});

client.initialize();

client.on('disconnected', (reason) => {
    console.log('Disconnected from WhatsApp. Reason:', reason);
});
