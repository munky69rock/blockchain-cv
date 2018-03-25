import * as React from "react";
import * as Web3 from "web3";
import getWeb3 from "./util/getWeb3";

const styles = require("./App.css");

import { Munky69rockCV } from "./components/Munky69rockCV";
import { isDevelopment } from "./util/environments";
import { isMainNetwork } from "./util/network";

interface IAppState {
  web3: Web3;
}

class App extends React.Component<{}, IAppState> {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
    };
  }

  public async componentWillMount() {
    const web3 = await getWeb3();

    if (!await this.isValidEnvironment(web3)) {
      alert("Please use Main Ethereum Network to proceed.");
      return;
    }

    this.setState({
      web3,
    });

    console.log("MetaMask:", (this.state.web3.currentProvider as any).isMetaMask ? "yes" : "no");
    console.log("MIST:", (window as any).mist ? "yes" : "no");
  }

  public render() {
    return (
      <div className={styles.app}>

        <div className={styles.appIntro}>
          {this.state.web3 ? (
            <div>
              {(this.state.web3.currentProvider as any).host ?
                <p>Provider is {(this.state.web3.currentProvider as any).host}</p> : null}
            </div>
          ) :
            <div className={styles.loading}>
              <div>Web3 is loading</div>
            </div>
          }
        </div>

        {this.state.web3 ? <Munky69rockCV web3={this.state.web3} /> : null}
      </div>
    );
  }

  private async isValidEnvironment(web3: Web3): Promise<boolean> {
    if (isDevelopment()) {
      return true;
    }

    return isMainNetwork(web3);
  }
}

export default App;
