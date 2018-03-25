import * as BigNumber from "bignumber.js";
import * as Web3 from "web3";

interface IProfile {
  name: string;
  email: string;
  title: string;
  location: string;
  description: string;
}

interface IEducation {
  name: string;
  fieldOfStudy: string;
  startedOn: string;
  endedOn: string;
  description: string;
}

interface IExperience {
  name: string;
  role: string;
  startedOn: string;
  endedOn: string;
  description: string;
}

interface ILink {
  linkType: string;
  url: string;
}

interface IMetadata {
  title: string;
  address: string;
  description: string;
}

interface IListableWrapperProps {
  web3: Web3;
  contractInstance: IMunky69rockCV;
  isOwner: boolean;
}

interface IListableElementProps extends IListableWrapperProps {
  id: number;
}

interface IMunky69rockCV {
  address: string;

  getProfile(): Promise<[string, string, string, string, string]>;
  editProfile(name: string, email: string, title: string, location: string, description: string, option?: any):
    Promise<BigNumber.BigNumber>;

  getExperienceCount(): Promise<BigNumber.BigNumber>;
  getExperience(id: number): Promise<[string, string, string, string, string]>;
  addExperience(name: string, role: string, startedOn: string, endedOn: string, description: string, option?: any):
    Promise<BigNumber.BigNumber>;
  editExperience(id: number, name: string, role: string,
                 startedOn: string, endedOn: string, description: string,
                 option?: any): Promise<void>;

  getEducationCount(): Promise<BigNumber.BigNumber>;
  getEducation(id: number): Promise<[string, string, string, string, string]>;
  addEducation(name: string, fieldOfStudy: string, startedOn: string, endedOn: string,
               description: string, option?: any): Promise<BigNumber.BigNumber>;
  editEducation(id: number, name: string, fieldOfStudy: string, startedOn: string,
                endedOn: string, description: string, option?: any): Promise<void>;

  getLinkCount(): Promise<BigNumber.BigNumber>;
  getLink(id: number): Promise<[string, string]>;
  addLink(linkType: string, url: string, option?: any): Promise<BigNumber.BigNumber>;
  editLink(id: number, linkType: string, url: string, option?: any): Promise<void>;

  getSkillCount(): Promise<BigNumber.BigNumber>;
  getSkill(id: number): Promise<string>;
  addSkill(skill: string, option?: any): Promise<void>;
  editSkill(id: number, skill: string, option?: any): Promise<BigNumber.BigNumber>;

  getLastUpdated(): Promise<BigNumber.BigNumber>;

  isOwner(option?: any): Promise<boolean>;

  getAuthor(): Promise<[string, string]>;

  getTitle(): Promise<string>;
  setTitle(title: string, option?: any);

  getAddress(): Promise<string>;
  setAddress(address: string, option?: any);

  getDescription(): Promise<string>;
  setDescription(description: string, option?: any);

  sendTransaction(optipon: any): Promise<Web3.TransactionReceipt>;

  UpdatedProfile(filter?: any, option?: any): Web3.FilterResult;
  UpdatedExperience(filter?: any, option?: any): Web3.FilterResult;
  UpdatedEducation(filter?: any, option?: any): Web3.FilterResult;
  UpdatedLink(filter?: any, option?: any): Web3.FilterResult;
  UpdatedSkill(filter?: any, option?: any): Web3.FilterResult;
  UpdatedMetadata(filter?: any, option?: any): Web3.FilterResult;
  ReceivedFunds(filter?: any, option?: any): Web3.FilterResult;
}

export {
  IProfile, IEducation, IExperience, ILink, IMunky69rockCV,
  IMetadata, IListableWrapperProps, IListableElementProps,
};
