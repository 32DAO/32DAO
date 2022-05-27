var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

const nft_address = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

var git = 0;
var pw = false;
let pwd = false;
var commands = [];
let provider;
let signer;
let nft;
let price;

setTimeout(function () {
  loopLines(banner, "", 80);
  textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

console.log(
  "%c31337 H4X0R",
  "color: #04ff00; font-weight: bold; font-size: 24px;"
);
console.log("%cLFG!: '" + "' - I wonder what it does?🤔", "color: grey");

//init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  if (pw) {
    let et = "*";
    let w = textarea.value.length;
    command.innerHTML = et.repeat(w);
    if (textarea.value === password) {
      pwd = true;
    }
    if (pwd && e.keyCode == 13) {
      loopLines(secret, "color2 margin", 120);
      command.innerHTML = "";
      textarea.value = "";
      pwd = false;
      pw = false;
      liner.classList.remove("password");
    } else if (e.keyCode == 13) {
      addLine("Wrong password", "error", 0);
      command.innerHTML = "";
      textarea.value = "";
      pw = false;
      liner.classList.remove("password");
    }
  } else {
    if (e.keyCode == 13) {
      commands.push(command.innerHTML);
      git = commands.length;
      addLine("guest@32DAO.com:~$ " + command.innerHTML, "no-animation", 0);
      commander(command.innerHTML.toLowerCase());
      command.innerHTML = "";
      textarea.value = "";
    }
    if (e.keyCode == 38 && git != 0) {
      git -= 1;
      textarea.value = commands[git];
      command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
      git += 1;
      if (commands[git] === undefined) {
        textarea.value = "";
      } else {
        textarea.value = commands[git];
      }
      command.innerHTML = textarea.value;
    }
  }
}

async function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "whois":
      loopLines(whois, "color2 margin", 80);
      break;
    case "mint":
      loopLines(["you can ape in soon..."], "color2 margin", 80);
      break;
    case "account":
      await viewAccount();
      break;
    case "nft":
      await viewNFT();
      break;
    case "video":
      addLine("Opening YouTube...", "color2", 80);
      newTab(youtube);
      break;
    case "social":
      loopLines(social, "color2 margin", 80);
      break;
    case "gpg":
      loopLines(gpg, "color2 margin", 80);
      break;
    case "secret":
      liner.classList.add("password");
      pw = true;
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      addLine(
        'Opening mailto:<a href="mailto:forrest@fkcodes.com">forrest@fkcodes.com</a>...',
        "color2",
        80
      );
      newTab(email);
      break;
    case "clear":
      setTimeout(function () {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "banner":
      loopLines(banner, "", 80);
      break;
    // socials
    case "discord":
      addLine("Opening Discord...", "color2", 80);
      newTab(discord);
      break;
    case "twitter":
      addLine("Opening Twitter...", "color2", 0);
      newTab(twitter);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    default:
      addLine(
        '<span class="inherit">Command not found. For a list of commands, type <span class="command">\'help\'</span>.</span>',
        "error",
        100
      );
      break;
  }
}

function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function () {
    var next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
}

async function viewAccount() {
  if (window.ethereum !== "undefined") {
    // loopLines(["connecting....."], "color2 margin", 80);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const nft = new ethers.Contract(nft_address, abi, signer);
    console.log("nft address: ", nft.address)

    const bal = (ethers.utils.formatEther(await provider.getBalance(address)))
      .toString()
      .split(".")
    console.log(bal)
    const balance = bal[0] + "." + bal[1].substring(0, 4);

    loopLines(
      [
        `<br/>`,
        `======================= Account ===========================`,
        `<span class="command">Address</span>         ${address}`,
        `<span class="command">Ξ${balance}</span>         Ethereum Balance`,
        `<span class="command">False</span>           Whitelisted`,
        `<span class="command">False</span>           Minted DAO token`,
        `<span class="command">0</span>               Tokens owned`,
        `===========================================================`,
        `<br/>`,
      ],
      "color2 margin",
      80
    );
    console.log("address", address);
  } else {
    console.log("No ethereum found");
    loopLines(["Metamask not found"], "color2 margin", 80);
  }
}

async function viewNFT() {
  if (window.ethereum !== "undefined") {

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();

    nft = new ethers.Contract(nft_address, abi, signer);
    console.log("nft address: ", nft.address)
    price = ethers.utils.formatEther((await nft.PRICE()).toString())
    const minted = parseInt(ethers.utils.formatEther((await nft.tokenCount()).toString()))

    loopLines(
      [
        `<br/>`,
        `===================== Membership NFT =====================`,
        `<span class="command">Address</span>         ${(await nft.address)}`,
        `<span class="command">Ξ${price}</span>           NFT price per token`,
        `<span class="command">420</span>             Max Tokens`,
        `<span class="command">${minted}</span>               Minted Tokens`,
        `===========================================================`,
        `<br/>`,
      ],
      "color2 margin",
      80
    );
    console.log("address", address);
  } else {
    console.log("No ethereum found");
    loopLines(["Metamask not found"], "color2 margin", 80);
  }
}