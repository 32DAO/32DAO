state = {
  before: document.getElementById("before"),
  command: document.getElementById("typer"),
  textarea: document.getElementById("texter"),
  terminal: document.getElementById("terminal"),
  git: 0,
  commands: [],
  provider,
  signer,
  nft,
  price,
  nft_address: "0xC9a3B8CCDefee8cDcFa257cdb58cDee346f1EfEc",
};

functions = {
  enterKey: (e) => {
    if (e.keyCode == 181) {
      document.location.reload(true);
    } else {
      if (e.keyCode == 13) {
        state.commands.push(command.innerHTML);
        state.git = state.commands.length;
        addLine(
          "guest@32DAO.com:~$ " + state.command.innerHTML,
          "no-animation",
          0
        );
        commander(state.command.innerHTML.toLowerCase());
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
        loopLines(help, "color2 margin", 80);
        break;
      case "whois":
        loopLines(whois, "color2 margin", 80);
        break;
      case "mint":
        await mintNFT();
        break;
      case "account":
        await viewAccount();
        break;
      case "nft":
        console.log(error);
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
      case "history":
        addLine("<br>", "", 0);
        loopLines(state.commands, "color2", 80);
        addLine("<br>", "command", 80 * state.commands.length + 50);
        break;
      case "email":
        addLine(
          'Opening mailto:<a href="mailto:32DAO@protonmail.com">32DAO@protonmail.com</a>...',
          "color2",
          80
        );
        newTab(email);
        break;
      case "clear":
        setTimeout(function () {
          state.terminal.innerHTML = '<a id="before"></a>';
          state.before = document.getElementById("before");
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
      addLine(item, style, index * time);
    });
  },
  viewAccount: async () => {
    if (window.ethereum !== "undefined") {
      try {
        // loopLines(["connecting....."], "color2 margin", 80);
        state.provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("provider", state.provider);
        state.signer = state.provider.getSigner();
        console.log("signer", state.signer);
        state.address = await state.signer.getAddress();
        console.log("address ", state.address);
        state.nft = new ethers.Contract(state.nft_address, abi, state.signer);
        console.log("nft address: ", state.nft.address);
        state.balance = await provider.getBalance(address);
        console.log("balance: ", balance);
        // const bal = ethers.utils
        //   .formatEther(await provider.getBalance(address))
        //   .toString()
        //   .split(".");
        // console.log(bal);
        // const balance = bal[0] + "." + bal[1].substring(0, 4);

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
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No ethereum found");
      loopLines(["Metamask not found"], "color2 margin", 80);
    }
  },
  viewNFT: async () => {
    if (window.ethereum !== "undefined") {
      state.provider = new ethers.providers.Web3Provider(window.ethereum);
      state.signer = provider.getSigner();
      const address = await signer.getAddress();

      state.nft = new ethers.Contract(state.nft_address, abi, state.signer);
      console.log("nft address: ", state.nft.address);
      state.price = ethers.utils.formatEther(
        (await state.nft.PRICE()).toString()
      );
      const minted = parseInt((await state.nft.totalSupply()).toString());

      loopLines(
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
      loopLines(["Metamask not found"], "color2 margin", 80);
    }
  },
  mintNFT: async () => {
    if (window.ethereum !== "undefined") {
      state.provider = new ethers.providers.Web3Provider(window.ethereum);
      state.signer = provider.getSigner();
      const address = await state.signer.getAddress();

      state.nft = new ethers.Contract(state.nft_address, abi, state.signer);
      state.price = await state.nft.PRICE();
      loopLines(
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
      loopLines([`Minting tokenId: ${minted} to: ${address}`]);
      Promise.resolve(tx.wait()).then(function (tx) {
        console.log("tx", tx);
        newTab(
          `https://opensea.io/assets/ethereum/0xC9a3B8CCDefee8cDcFa257cdb58cDee346f1EfEc/${minted}`
        );
        newTab(discord);
      });
    } else {
      console.log("No ethereum found");
      loopLines(["Metamask not found"], "color2 margin", 80);
    }
  },
  commander: async (cmd) => {
    switch (cmd.toLowerCase()) {
      case "help":
        loopLines(help, "color2 margin", 80);
        break;
      case "whois":
        loopLines(whois, "color2 margin", 80);
        break;
      case "mint":
        await mintNFT();
        break;
      case "account":
        await viewAccount();
        break;
      case "nft":
        console.log(error);
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
      case "history":
        addLine("<br>", "", 0);
        loopLines(state.commands, "color2", 80);
        addLine("<br>", "command", 80 * state.commands.length + 50);
        break;
      case "email":
        addLine(
          'Opening mailto:<a href="mailto:32DAO@protonmail.com">32DAO@protonmail.com</a>...',
          "color2",
          80
        );
        newTab(email);
        break;
      case "clear":
        setTimeout(function () {
          state.terminal.innerHTML = '<a id="before"></a>';
          state.before = document.getElementById("before");
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
  },
};

setTimeout(function () {
  loopLines(banner, "", 80);
  state.textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

console.log(
  "%c31337 H4X0R",
  "color: #04ff00; font-weight: bold; font-size: 24px;"
);
console.log("%cLFG!: ", "color: grey");

//init
state.textarea.value = "";
state.command.innerHTML = state.textarea.value;
