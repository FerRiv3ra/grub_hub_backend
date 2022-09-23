const signInAndForgotHTML = (name, token, changePass) => {
  const frontUrl = process.env.FRONT_URL;

  const html = `
<body>
  <div style="
      height: 450;
      background-color: white;
    ">
    <img src="https://res.cloudinary.com/fercloudinary/image/upload/v1649004128/logovc_hhozh3.png" style="
      margin: 0 auto;
      display: block;
      width: 200px;
    " />
    <h3>This is an automated message from the server, please don't reply.</h3>
    <h4>Hello ${name} ${
    changePass ? 'a new password was requested' : 'this is 2-Step Verification'
  }</h4>
    <p>Please copy the next code to verify your identity</p>
    <div
      style="
        background-color: #336210;
        width: fit-content;
        margin: 0 auto;
        padding: 5px 10px;
        border-radius: 5px;
      " 
    >
      <p style="text-align: center; color: white">${token}</p>
    </div>
    <p style="text-align: center;">Or clic <a href="${frontUrl}/${
    changePass ? `forgot-password/${token}` : `verify/${token}`
  }">here</a> to continue in the web in a new tab</p>
    <div style="
  height: 80px;
  background-color: #336210">
      <a href="http://www.thevinecentre.org.uk" style="
    text-decoration: none;
    text-align: center;
    padding: 25px;
    color: white;
    display: block;
    font-size: large;
  ">The Vine Centre © ${new Date().getFullYear()}</a>
    </div>
  </div>
</body>
`;

  return html;
};

module.exports = signInAndForgotHTML;
