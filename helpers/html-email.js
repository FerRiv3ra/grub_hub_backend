const emailHTML = `
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
    <h4>Attached is the report.</h4>
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

module.exports = emailHTML;