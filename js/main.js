let before = document.getElementById("before");
let command = document.getElementById("typer");
let textarea = document.getElementById("texter");
let terminal = document.getElementById("terminal");
let git = 0;
let commands = [];
let provider = null;
let signer = null;
let nft = null;
let price = null;
let nft_address = "0xC9a3B8CCDefee8cDcFa257cdb58cDee346f1EfEc";

app = {
  connectWallet: async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum, "mainnet");
    provider.send("eth_requestAccounts", []).then(() => {
      provider.listAccounts().then(async (accounts) => {
        signer = provider.getSigner(accounts[0]);
        nft = new ethers.Contract(nft_address, abi, signer);
        price = await nft.PRICE();
      });
    });
  },
  enterKey: (e) => {
    if (e.keyCode == 181) {
      document.location.reload(true);
    } else {
      if (e.keyCode == 13) {
        commands.push(command.innerHTML);
        git = commands.length;
        app.addLine(
          "guest@32DAO.com:~$ " + command.innerHTML,
          "no-animation",
          0
        );
        app.commander(command.innerHTML.toLowerCase());
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
  },
  commander: async (cmd) => {
    switch (cmd.toLowerCase()) {
      case "help":
        app.loopLines(help, "color2 margin", 80);
        break;
      case "whois":
        app.loopLines(whois, "color2 margin", 80);
        break;
      case "mint":
        await app.mintNFT();
        break;
      case "account":
        await app.viewAccount();
        break;
      case "nft":
        await app.viewNFT();
        break;
      case "opensea":
        app.newTab(
          `https://opensea.io/assets?search[query]=0xC9a3B8CCDefee8cDcFa257cdb58cDee346f1EfEc`
        );
        break;
      case "video":
        app.addLine("Opening YouTube...", "color2", 80);
        app.newTab(youtube);
        break;
      case "social":
        app.loopLines(social, "color2 margin", 80);
        break;
      case "gpg":
        app.loopLines(gpg, "color2 margin", 80);
        break;
      case "history":
        app.addLine("<br>", "", 0);
        app.loopLines(commands, "color2", 80);
        app.addLine("<br>", "command", 80 * commands.length + 50);
        break;
      case "email":
        app.addLine(
          'Opening mailto:<a href="mailto:32DAO@protonmail.com">32DAO@protonmail.com</a>...',
          "color2",
          80
        );
        app.newTab(email);
        break;
      case "clear":
        setTimeout(function () {
          terminal.innerHTML = '<a id="before"></a>';
          before = document.getElementById("before");
        }, 1);
        break;
      case "banner":
        app.loopLines(banner, "", 80);
        break;
      // socials
      case "discord":
        app.addLine("Opening Discord...", "color2", 80);
        app.newTab(discord);
        break;
      case "twitter":
        app.addLine("Opening Twitter...", "color2", 0);
        app.newTab(twitter);
        break;
      case "github":
        app.addLine("Opening GitHub...", "color2", 0);
        app.newTab(github);
        break;
      default:
        app.addLine(
          '<span class="inherit">Command not found. For a list of commands, type <span class="command">\'help\'</span>.</span>',
          "error",
          100
        );
        break;
    }
  },
  newTab: async (link) => {
    setTimeout(function () {
      window.open(link, "_blank");
    }, 500);
  },
  addLine: async (text, style, time) => {
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
  },
  loopLines: (name, style, time) => {
    name.forEach(function (item, index) {
      app.addLine(item, style, index * time);
    });
  },
  viewAccount: async () => {
    if (window.ethereum !== "undefined") {
      try {
        // app.loopLines(["connecting....."], "color2 margin", 80);
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        address = await signer.getAddress();
        nft = new ethers.Contract(nft_address, abi, signer);
        balance = await provider.getBalance(address);
        const bal = ethers.utils
          .formatEther(await provider.getBalance(address))
          .toString()
          .split(".");
        console.log(bal);
        balance = bal[0] + "." + bal[1].substring(0, 4);
        const tokensOwned = await nft.balanceOf(address);
        app.loopLines(
          [
            `<br/>`,
            `======================= Account ===========================`,
            `<span class="command">Address</span>         ${address}`,
            `<span class="command">Ξ${balance}</span>         Ethereum Balance`,
            `<span class="command"> ${tokensOwned}</span>               DAO NFTs Owned`,
            `===========================================================`,
            `<br/>`,
          ],
          "color2 margin",
          80
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No ethereum found");
      app.loopLines(["Metamask not found"], "color2 margin", 80);
    }
  },
  viewNFT: async () => {
    if (window.ethereum !== "undefined") {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const address = await signer.getAddress();

      nft = new ethers.Contract(nft_address, abi, signer);
      console.log("nft address: ", nft.address);

      const minted = parseInt((await nft.totalSupply()).toString());

      const pri = ethers.utils
        .formatEther(await nft.PRICE())
        .toString()
        .split(".");
      const nftPrice = pri[0] + "." + pri[1].substring(0, 3);

      app.loopLines(
        [
          `<br/>`,
          `===================== Membership NFT =====================`,
          `<span class="command">Address</span>         ${await nft.address}`,
          `<span class="command">Ξ${nftPrice}</span>          NFT price per token`,
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
      app.loopLines(["Metamask not found"], "color2 margin", 80);
    }
  },
  mintNFT: async () => {
    if (window.ethereum !== "undefined") {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const address = await signer.getAddress();

      nft = new ethers.Contract(nft_address, abi, signer);
      price = await nft.PRICE();
      const userBalance = await provider.getBalance(address);

      const bal = ethers.utils.formatEther(userBalance).toString().split(".");
      balance = bal[0] + "." + bal[1].substring(0, 3);

      if (userBalance.gt(price)) {
        app.loopLines(
          [
            `Confirm to mint 1 Membership NFT for Ξ${ethers.utils.formatEther(
              price.toString()
            )}`,
          ],
          "color2 margin",
          80
        );
        const minted = parseInt(await nft.totalSupply());
        tx = await nft.mint({ value: price });
        app.loopLines([`Minting tokenId: ${minted} to: ${address}`]);
        console.log(tx);
        Promise.resolve(tx.wait()).then(function (tx) {
          console.log("tx", tx);
          app.newTab(
            `https://opensea.io/assets/ethereum/0xC9a3B8CCDefee8cDcFa257cdb58cDee346f1EfEc/${minted}`
          );
          app.newTab(discord);
        });
      } else {
        const pri = ethers.utils
          .formatEther(await nft.PRICE())
          .toString()
          .split(".");
        const nftPrice = pri[0] + "." + pri[1].substring(0, 3);
        app.loopLines([
          `<br/>`,
          `======================= NOT ENOUGH ETH ===========================`,
          `<span class="command">Ξ${nftPrice}</span>         NFT Price`,
          `<span class="command">Ξ${balance}</span>         Ethereum Balance`,
          `<br/>`,
        ]);
      }
    } else {
      console.log("No ethereum found");
      app.loopLines(["Metamask not found"], "color2 margin", 80);
    }
  },
};

window.addEventListener("keyup", app.enterKey);
textarea.value = "";
command.innerHTML = textarea.value;

setTimeout(async () => {
  await app.connectWallet().then(() => {
    app.loopLines(banner, "", 80);
    textarea.focus();
  });
}, 100);
