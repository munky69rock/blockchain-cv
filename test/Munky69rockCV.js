const Munky69rockCV = artifacts.require("./Munky69rockCV.sol");

const capitalize = (str) => str.replace(/^(.)/, (s) => s.toUpperCase());

const assertUpdateEvent = (eventClass) => {
  const event = eventClass();
  event.watch((err) => {
    assert.isNull(err);
    event.stopWatching();
  });
};

const assertReceivedFunds = (contract, amount) => {
  const event = contract.ReceivedFunds();
  event.watch((err, result) => {
    assert.equal(result.args.amount, amount);
    event.stopWatching();
  });
};

contract('Munky69rockCV', accounts => {
  let contract;

  before(async () => {
    contract = await Munky69rockCV.deployed();
  });

  describe('metadata', () => {
    ['address', 'title', 'description'].forEach((prop) => {
      const capitalized = capitalize(prop);
      const getMethod = `get${capitalized}`;
      const setMethod = `set${capitalized}`;

      it(`should return ${prop}`, async () => {
        const contractProp = await contract[getMethod]();
        assert.isAbove(contractProp.length, 0);
      });

      it(`can set ${prop}`, async () => {
        const newProp = `new_${prop}`;
        assertUpdateEvent(contract.UpdatedMetadata);
        await contract[setMethod](newProp);
        const contractProp = await contract[getMethod]();
        assert.equal(newProp, contractProp);
      })
    });
  });

  describe('profile', () => {
    it('should have default value', async () => {
      let [name, email] = await contract.getAuthor();
      assert.equal(name, "Masayuki Uehara");
      assert.equal(email, "munky69rock@gmail.com");
    });

    it('can edit', async () => {
      const newProps = [
          "munky69rock",
          "mail@example.com",
          "Ethereum master",
          "EVM",
          "Hello, Solidity",
      ];
      const lastUpdated = (await contract.getLastUpdated()).toNumber();

      assertUpdateEvent(contract.UpdatedProfile);

      await contract.editProfile(...newProps);
      let contractProps = await contract.getProfile();
      const newLastUpdated = (await contract.getLastUpdated()).toNumber();

      assert.deepEqual(contractProps, newProps);
      assert.isAtLeast(newLastUpdated, lastUpdated);
    });
  });

  describe('experience', () => {
    it('should have default value', async () => {
      const props = await contract.getExperience(0);

      // description is empty now, so excluded
      props.slice(0, props.length - 1).forEach(prop => {
        assert.isAbove(prop.length, 0);
      });
    });

    it('can add', async () => {
      const count = (await contract.getExperienceCount()).toNumber();
      const props = ['Company name', 'engineer', '2018-01-01', '2018-12-31', ''];
      await contract.addExperience(...props);
      const newCount = (await contract.getExperienceCount()).toNumber();

      assertUpdateEvent(contract.UpdatedExperience);
      assert.equal(newCount, count + 1);
      assert.deepEqual(await contract.getExperience(newCount - 1), props);
    });

    it('can edit', async () => {
      const id = 0;
      const oldProps = await contract.getExperience(id);
      const newProps = ['New Company Name', 'Manager', '2010-01-01', '2012-12-31', 'Oops'];
      await contract.editExperience(id, ...newProps);
      const contractProps = await contract.getExperience(id);

      assertUpdateEvent(contract.UpdatedExperience);
      assert.deepEqual(contractProps, newProps);
      assert.notDeepEqual(contractProps, oldProps);
    });
  });

  describe('education', () => {
    it('should have default value', async () => {
      const props = await contract.getEducation(0);

      // description is empty now, so excluded
      props.slice(0, props.length - 1).forEach(prop => {
        assert.isAbove(prop.length, 0);
      });
    });

    it('can add', async () => {
      const count = (await contract.getEducationCount()).toNumber();
      const props = ['School name', 'Economics', '2018-01-01', '2018-12-31', 'description'];
      await contract.addEducation(...props);
      const newCount = (await contract.getEducationCount()).toNumber();

      assertUpdateEvent(contract.UpdatedEducation);
      assert.equal(newCount, count + 1);
      assert.deepEqual(await contract.getEducation(newCount - 1), props);
    });

    it('can edit', async () => {
      const id = 0;
      const oldProps = await contract.getEducation(id);
      const newProps = ['New School Name', 'Science', '2010-01-01', '2012-12-31', 'Oops'];
      await contract.editEducation(id, ...newProps);
      const contractProps = await contract.getEducation(id);

      assertUpdateEvent(contract.UpdatedEducation);
      assert.deepEqual(contractProps, newProps);
      assert.notDeepEqual(contractProps, oldProps);
    });
  });

  describe('link', () => {
    it('should have default value', async () => {
      const props = await contract.getLink(0);

      props.forEach(prop => {
        assert.isAbove(prop.length, 0);
      });
    });

    it('can add', async () => {
      const count = (await contract.getLinkCount()).toNumber();
      const props = ['cool web service', 'https://cool.example.com'];
      await contract.addLink(...props);
      const newCount = (await contract.getLinkCount()).toNumber();

      assertUpdateEvent(contract.UpdatedLink);
      assert.equal(newCount, count + 1);
      assert.deepEqual(await contract.getLink(newCount - 1), props);
    });

    it('can edit', async () => {
      const id = 0;
      const oldProps = await contract.getLink(id);
      const newProps = ['excellent web service', 'https://excellent.example.com'];
      await contract.editLink(id, ...newProps);
      const contractProps = await contract.getLink(id);

      assertUpdateEvent(contract.UpdatedLink);
      assert.deepEqual(contractProps, newProps);
      assert.notDeepEqual(contractProps, oldProps);
    });
  });

  describe('skill', () => {
    it('should have default value', async () => {
      const skill = await contract.getSkill(0);

      assert.isAbove(skill.length, 0);
    });

    it('can add', async () => {
      const count = (await contract.getSkillCount()).toNumber();
      const skill = 'Ethereum';
      await contract.addSkill(skill);
      const newCount = (await contract.getSkillCount()).toNumber();

      assertUpdateEvent(contract.UpdatedSkill);
      assert.equal(newCount, count + 1);
      assert.deepEqual(await contract.getSkill(newCount - 1), skill);
    });

    it('can edit', async () => {
      const id = 0;
      const oldSkill = await contract.getSkill(id);
      const newSkill = 'Ethereum';
      await contract.editSkill(id, newSkill);
      const skill = await contract.getSkill(id);

      assertUpdateEvent(contract.UpdatedSkill);
      assert.equal(skill, newSkill);
      assert.notEqual(skill, oldSkill);
    });
  });

  describe('tip me', () => {
    it('can receive ether', async () => {
      const amountToSend = web3.toWei(1, 'ether');
      const someone = accounts[1];
      await contract.sendTransaction({ from: someone, to: contract.address, value: amountToSend });
      const balance = await web3.eth.getBalance(contract.address);

      assertReceivedFunds(contract, amountToSend);
      assert.equal(balance.toNumber(), amountToSend);
    });

    it('can transfer ether to owner', async () => {
      const amountToReceive = web3.toWei(0.5, 'ether');
      const owner = accounts[0];
      const balanceBefore = await web3.eth.getBalance(owner);
      const txHash = await contract.transfer(owner, amountToReceive);
      const tx = await web3.eth.getTransaction(txHash.tx);
      const balanceAfter = await web3.eth.getBalance(owner);
      const gasCost = tx.gasPrice.mul(txHash.receipt.gasUsed);

      assert.equal(balanceAfter.toNumber(), balanceBefore.plus(amountToReceive).minus(gasCost).toNumber());
    });

    it('cannot transfer ether to someone', () => {
      const amountToReceive = web3.toWei(0.5, 'ether');
      const someone = accounts[1];
      return contract.transfer(someone, amountToReceive, { from: someone }).catch(err => {
        assert.match(err, /VM Exception/);
      });
    });
  });
});
