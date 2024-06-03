const welcomeEmail = (name) => {
  const email = {
    body: {
      name: name,
      intro: [
        "Thank you for registering on ourv WebTransportBidirectionalStream.",
        "We are very excited to have you on board.",
      ],
      action: {
        instructions: "Please take aminute to complete your profile",
        button: {
          color: "#3869D4",
          text: "confirm your account",
          link: "https://mailgen.is/confirm?",
        },
      },
      outro: "if you need help, just hola -- we're there!",
    },
  };
  return email;
};

module.exports = {
  welcomeEmail,
};
