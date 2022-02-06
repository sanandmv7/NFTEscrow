// connect to Moralis server
const serverUrl = "SERVER_URL";
const appId = "APP_ID";
Moralis.start({ serverUrl, appId });

loginBtnWC = document.getElementById("btn-walletconnect");
loginBtnMM = document.getElementById("btn-metamask");
logoutBtn = document.getElementById("btn-logout");
listBtn = document.getElementById("btn-list");
sendBtn = document.getElementById("sendBtn-modal");
receiveBtn = document.getElementById("btn-receive");
cardDiv = document.getElementById("card0");
balanceText = document.getElementById("balance-text");
contract_address = document.getElementById("send-contract");
tokenid = document.getElementById("send-tokenid");
tokentype = document.getElementById("send-type");
receiver = document.getElementById("send-receiver");
price = document.getElementById("send-price");
status_text = document.getElementById("status");

var user, web3;

// logoutBtn.style.visibility = 'hidden';

// add from here down
// async function login() {
//   let user = Moralis.User.current();
//   if (!user) {
//     user = await Moralis.authenticate();
//   }
//   console.log("logged in user:", user);
// }

// async function logOut() {
//   await Moralis.User.logOut();
//   console.log("logged out");
// }

// Functions to open and close a modal
function openSendModal(address, _tokenid, type, el) {
    contract_address.value = address;
    tokenid.value = _tokenid;
    tokentype.value = type;
    openModal(el);
}

function openModal($el) {
    $el.classList.add('is-active');
}

function closeModal($el) {
    $el.classList.remove('is-active');
}

function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
    });
}

async function getErc20balance(){
    try {
        let options = {chain: "rinkeby", address: user.get('ethAddress')};
        let erc20bal = await Moralis.Web3.getAllERC20(options);
        let ethBalance = erc20bal[0].balance/1000000000000000000;
        balanceText.innerHTML = `Balance: ${ethBalance} ether`;
        // balanceText.classList.toggle("is-visible");
        if(balanceText.classList.contains('is-info')){
            balanceText.classList.toggle('is-info');
        }

        if(balanceText.classList.contains('is-danger')){
            balanceText.classList.toggle('is-danger');
        }

        if(!balanceText.classList.contains('is-success')){
            balanceText.classList.toggle('is-success');
        }

    } catch (error) {
        console.log('balance request failed: ', error);
        balanceText.innerHTML = "Error Fetching Balance";
        // balanceText.classList.toggle("is-hidden");
        if(balanceText.classList.contains('is-info')){
            balanceText.classList.toggle('is-info');
        }
        if(balanceText.classList.contains('is-success')){
            balanceText.classList.toggle('is-success');
        }
        if(!balanceText.classList.contains('is-danger')){
            balanceText.classList.toggle("is-danger");
        }
    }
}

async function sendERC721(_contract_address, _tokenid, _payee, _amount) {
    let options = {
        contractAddress: "CONTRACT_ADDRESS",
        functionName: "depositERC721",
        abi: [{
			"inputs": [
				{
					"internalType": "address",
					"name": "_nftContract",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_tokenId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "_receiver",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_price",
					"type": "uint256"
				}
			],
			"name": "depositERC721",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}],
        params: {_nftContract: _contract_address, _tokenId: _tokenid, _receiver: _payee, _price: _amount}
    }

    const transaction = await Moralis.executeFunction(options);
    console.log(transaction.hash);
    const result = await transaction.wait()
}

async function sendERC1155(_contract_address, _tokenid, _payee, _amount) {
    let options = {
        contractAddress: "CONTRACT_ADDRESS",
        functionName: "deposit1155",
        abi: [{
			"inputs": [
				{
					"internalType": "address",
					"name": "_nftContract",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_tokenId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "_receiver",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_price",
					"type": "uint256"
				}
			],
			"name": "deposit1155",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}],
        params: {_nftContract: _contract_address, _tokenId: _tokenid, _receiver: _payee, _price: _amount}
    }

    const transaction = await Moralis.executeFunction(options);
    console.log(transaction.hash);
    const result = await transaction.wait()
    console.log("send ERC1155 complete");
}


loginBtnWC.addEventListener('click', async() => {
    // console.log("WC button clicked");
    // var web3;
    // const user = await Moralis.authenticate({ 
    //     provider: "walletconnect", 
    //     mobileLinks: [
    //       "rainbow",
    //       "metamask",
    //       "argent",
    //       "trust",
    //       "imtoken",
    //       "pillar",
    //     ] ,
    try {
        user = await Moralis.authenticate({provider: 'walletconnect'});
        await Moralis.enableWeb3();
        // web3 = await Moralis.web3.enable({provider: 'walletconnect'});
        loginBtnWC.classList.toggle('is-hidden');
        loginBtnMM.classList.toggle('is-hidden');
        logoutBtn.classList.toggle('is-hidden');
        cardDiv.classList.toggle('is-hidden');
    } catch (error) {
        console.log('authentication failed: ', error);
    }
    getErc20balance();
    // console.log("WC Auth Complete");
})

loginBtnMM.addEventListener('click', async() => {
    // console.log("MM button clicked");
    user = Moralis.User.current();
    await Moralis.enableWeb3();
    // web3 = await Moralis.web3.enable({provider: 'walletconnect'});

    if (!user) {
        try {
            user = await Moralis.authenticate({ signingMessage: "Authenticate" })
            // console.log(user)
            // console.log(user.get('ethAddress'))
            loginBtnMM.classList.toggle('is-hidden');
            loginBtnWC.classList.toggle('is-hidden');
            logoutBtn.classList.toggle('is-hidden');
            cardDiv.classList.toggle('is-hidden');
        } catch (error) {
            console.log(error)
        }
        getErc20balance();
    }
    // console.log("MM Auth Complete");
})

logoutBtn.addEventListener('click', async() => {
    try{
        await Moralis.User.logOut();
        location.reload();
        // loginBtnWC.classList.toggle('is-hidden');
        // loginBtnMM.classList.toggle('is-hidden');
        // logoutBtn.classList.toggle('is-hidden');
        // cardDiv.classList.toggle('is-hidden');
    } catch (error) {
        console.log('Logout failed: ', error);
    }
})

listBtn.addEventListener('click', async() => {
    try {
        let options = {chain: "rinkeby", address: user.get('ethAddress')};
        let nfts = await Moralis.Web3.getNFTs(options);
        console.log(nfts);
        // url = nfts[0].token_uri;
        // fetch(url).then(function(response) {
        //     return response.json();
        //   }).then(function(data) {
        //     console.log(data["image"]);
        //   }).catch(function() {
        //     console.log("Booo");
        //   });
        // console.log(metadata);
        var container = document.getElementById('imageContainer');
        let length = Object.keys(nfts).length;
        if(length<1) {
            var span = document.createElement('span');
            span.innerHTML = "No NFTs to Display";
            container.appendChild(span);
        } else {
            var ul = document.createElement('ul');
            for (var i = 0, j = length; i < j; i++) {
                // var img = document.createElement('img');
                var li = document.createElement('li');
                // var span = document.createElement('span');
                // var a = document.createElement('a');
                var button = document.createElement('button');
                var button_select = document.createElement('button');
                // fetch(nfts[i].token_uri).then(function(response) {
                //     return response.json();
                //   }).then(function(data) {
                //     // img.src = data["image"];
                //     // console.log(data);
                //   }).catch(function() {
                //     console.log("Booo");
                //   });
                // span.innerHTML = `${nfts[i].name}`;
                // a.appendChild(span);
                // a.href = nfts[i].token_uri;
                button.innerHTML = `${nfts[i].name}`;
                button.addEventListener('click', (event) => { window.open(event.target.value, "_blank")});
                button.value = nfts[i].token_uri;
                button.id = nfts[i].token_id;
                button.classList.add("button");
                button.classList.add("is-warning");

                button_select.innerHTML = "Select";
                button_select.id = nfts[i].token_id;
                button_select.value = nfts[i].token_address;
                button_select.name = nfts[i].contract_type;
                button_select.addEventListener('click', (event) => {openSendModal(event.target.value, event.target.id, event.target.name, document.getElementById("modal-send"))});
                button_select.classList.add("button");
                button_select.classList.add("is-link");
                button_select.classList.add("ml-1");

                li.classList.add("my-1");
                li.appendChild(button);
                li.appendChild(button_select);
                ul.appendChild(li);
            }
            container.appendChild(ul);
        }
        container.classList.toggle("is-hidden");
    } catch(error) {
        console.log('getNFTs request failed: ', error);
        var container = document.getElementById('imageContainer');
        var span = document.createElement('span');
        span.innerHTML = "Error fetching NFTs";
        container.appendChild(span);
        container.classList.toggle("is-hidden");
    }

     // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel-btn') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
})

sendBtn.addEventListener('click', async(event) => {
    contract = contract_address.value;
    token = tokenid.value;
    type = tokentype.value;
    payee = receiver.value;
    amount = price.value;
    if(contract && token && type && payee && amount){
        try{
            if(type === "ERC721"){
                sendERC721(contract, token, payee, amount);
            } else if (type === "ERC1155") {
                sendERC1155(contract, token, payee, amount);
            } else {
                let element = status_text;
                element.innerHTML = "Invalid Token Type";
                if(element.classList.contains('is-info')){
                    element.classList.toggle('is-info');
                }
                if(element.classList.contains('is-success')){
                    element.classList.toggle('is-success');
                }
                if(!element.classList.contains('is-danger')){
                    element.classList.toggle('is-danger');
                }
                console.log("Invalid Token Type");
            }
            let element = status_text;
            element.innerHTML = "SUCCESS";
            if(element.classList.contains('is-info')){
                element.classList.toggle('is-info');
            }

            if(element.classList.contains('is-danger')){
                element.classList.toggle('is-danger');
            }

            if(!element.classList.contains('is-success')){
                element.classList.toggle('is-success');
            }
        } catch(error) {
            let element = status_text;
            element.innerHTML = "Something went wrong";
            if(element.classList.contains('is-info')){
                element.classList.toggle('is-info');
            }
            if(element.classList.contains('is-success')){
                element.classList.toggle('is-success');
            }
            if(!element.classList.contains('is-danger')){
                element.classList.toggle('is-danger');
            }
        }
    }else{
        let element = status_text;
        element.innerHTML = "Please check the arguments";
        if(element.classList.contains('is-info')){
            element.classList.toggle('is-info');
        }
        if(element.classList.contains('is-success')){
            element.classList.toggle('is-success');
        }
        if(!element.classList.contains('is-danger')){
            element.classList.toggle('is-danger');
        }
        console.log("Please check the arguments");
    }
});

 // Add a click event on various child elements to close the parent modal
 (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel-btn') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
        closeModal($target);
    });
});

// Add a keyboard event to close all modals
document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
        closeAllModals();
    }
});

// loginBtn.onclick = login;
// logoutBtn.onclick = logOut;