state = {
  before: document.getElementById("before"),
  command: document.getElementById("typer"),
  textarea: document.getElementById("texter"),
  terminal: document.getElementById("terminal"),
  git: 0,
  commands: [],
  provider: null,
  signer: null,
  nft: null,
  price: null,
  nft_address: "0xC9a3B8CCDefee8cDcFa257cdb58cDee346f1EfEc",
};

app = {
  connectWallet: async () => {
    state.provider = new ethers.providers.Web3Provider(
      window.ethereum,
      "mainnet"
    );
    state.provider.send("eth_requestAccounts", []).then(() => {
      state.provider.listAccounts().then(async (accounts) => {
        state.signer = state.provider.getSigner(accounts[0]);
        state.nft = new ethers.Contract(state.nft_address, abi, state.signer);
        state.price = await state.nft.PRICE();
      });
    });
  },
  enterKey: (e) => {
    if (e.keyCode == 181) {
      document.location.reload(true);
    } else {
      if (e.keyCode == 13) {
        state.commands.push(command.innerHTML);
        state.git = state.commands.length;
        app.addLine(
          "guest@32DAO.com:~$ " + state.command.innerHTML,
          "no-animation",
          0
        );
        app.commander(state.command.innerHTML.toLowerCase());
        state.command.innerHTML = "";
        state.textarea.value = "";
      }
      if (e.keyCode == 38 && state.git != 0) {
        state.git -= 1;
        state.textarea.value = state.commands[state.git];
        state.command.innerHTML = state.textarea.value;
      }
      if (e.keyCode == 40 && state.git != state.commands.length) {
        state.git += 1;
        if (state.commands[state.git] === undefined) {
          state.textarea.value = "";
        } else {
          state.textarea.value = state.commands[state.git];
        }
        state.command.innerHTML = state.textarea.value;
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
        app.loopLines(state.commands, "color2", 80);
        app.addLine("<br>", "command", 80 * state.commands.length + 50);
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
          state.terminal.innerHTML = '<a id="before"></a>';
          state.before = document.getElementById("before");
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

      state.before.parentNode.insertBefore(next, before);

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
        state.provider = new ethers.providers.Web3Provider(window.ethereum);
        state.signer = state.provider.getSigner();
        state.address = await state.signer.getAddress();
        state.nft = new ethers.Contract(state.nft_address, abi, state.signer);
        state.balance = await state.provider.getBalance(state.address);
        const bal = ethers.utils
          .formatEther(await state.provider.getBalance(state.address))
          .toString()
          .split(".");
        console.log(bal);
        state.balance = bal[0] + "." + bal[1].substring(0, 4);
        const tokensOwned = await state.nft.balanceOf(state.address);
        app.loopLines(
          [
            `<br/>`,
            `======================= Account ===========================`,
            `<span class="command">Address</span>         ${state.address}`,
            `<span class="command">Ξ${state.balance}</span>         Ethereum Balance`,
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
      state.provider = new ethers.providers.Web3Provider(window.ethereum);
      state.signer = state.provider.getSigner();
      const address = await state.signer.getAddress();

      state.nft = new ethers.Contract(state.nft_address, abi, state.signer);
      console.log("nft address: ", state.nft.address);

      const minted = parseInt((await state.nft.totalSupply()).toString());

      app.loopLines(
        [
          `<br/>`,
          `===================== Membership NFT =====================`,
          `<span class="command">Address</span>         ${await state.nft
            .address}`,
          `<span class="command">Ξ${state.price}</span>           NFT price per token`,
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
      state.provider = new ethers.providers.Web3Provider(window.ethereum);
      state.signer = state.provider.getSigner();
      const address = await state.signer.getAddress();

      state.nft = new ethers.Contract(state.nft_address, abi, state.signer);
      state.price = await state.nft.PRICE();
      const userBalance = await state.provider.getBalance(address);

      const bal = ethers.utils.formatEther(userBalance).toString().split(".");
      state.balance = bal[0] + "." + bal[1].substring(0, 3);

      if (userBalance.gt(state.price)) {
        app.loopLines(
          [
            `Confirm to mint 1 Membership NFT for Ξ${ethers.utils.formatEther(
              state.price.toString()
            )}`,
          ],
          "color2 margin",
          80
        );
        const minted = parseInt(await state.nft.totalSupply());
        tx = await state.nft.mint({ value: state.price });
        app.loopLines([`Minting tokenId: ${minted} to: ${address}`]);
        Promise.resolve(tx.wait()).then(function (tx) {
          console.log("tx", tx);
          app.newTab(
            `https://opensea.io/assets/ethereum/0xC9a3B8CCDefee8cDcFa257cdb58cDee346f1EfEc/${minted}`
          );
          app.newTab(discord);
        });
      } else {
        const pri = ethers.utils.formatEther(state.price).toString().split(".");
        const price = pri[0] + "." + pri[1].substring(0, 3);
        app.loopLines([
          `<br/>`,
          `======================= NOT ENOUGH ETH ===========================`,
          `<span class="command">Ξ${price}</span>         NFT Price`,
          `<span class="command">Ξ${state.balance}</span>         Ethereum Balance`,
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
state.textarea.value = "";
state.command.innerHTML = state.textarea.value;

setTimeout(async () => {
  await app.connectWallet().then(() => {
    app.loopLines(banner, "", 80);
    state.textarea.focus();
  });
}, 100);
