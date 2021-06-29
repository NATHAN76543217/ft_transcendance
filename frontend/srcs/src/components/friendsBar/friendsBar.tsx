import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import IUserInterface from '../interface/IUserInterface';
import IUserRelationship from '../interface/IUserRelationshipInterface';
import { UserRelationshipTypes } from '../userInformation/userRelationshipTypes';
import FriendItem from './friendsItem';

type FriendsBarProps = {

}

interface FriendsBarStates {
	list: IUserInterface[],
	displaySection: {
		pendingRequests: boolean,
		inGameFriends: boolean,
		onlineFriends: boolean,
		offlineFriends: boolean,
	}
}

class FriendsBar extends React.Component<FriendsBarProps, FriendsBarStates> {

	constructor(props: FriendsBarProps) {
		super(props);
		this.state = {
			list: [],
			displaySection: {
				pendingRequests: true,
				inGameFriends: true,
				onlineFriends: true,
				offlineFriends: true,
			}
		}
	}

	componentDidMount() {
		this.setAllRelationships();
	}

	componentDidUpdate() {
		// this.setAllRelationships();
		// console.log("friendsBar didUpdate")
	}

	changeSectionDisplayStatus(sectionName: string) {
		switch (sectionName) {
			case "pendingRequests":
				return this.setState({
					displaySection: {
						...this.state.displaySection,
						pendingRequests: !this.state.displaySection.pendingRequests
					}
				});
			case "inGameFriends":
				return this.setState({
					displaySection: {
						...this.state.displaySection,
						inGameFriends: !this.state.displaySection.inGameFriends
					}
				});
			case "onlineFriends":
				return this.setState({
					displaySection: {
						...this.state.displaySection,
						onlineFriends: !this.state.displaySection.onlineFriends
					}
				});
			case "offlineFriends":
				return this.setState({
					displaySection: {
						...this.state.displaySection,
						offlineFriends: !this.state.displaySection.offlineFriends
					}
				});
			default:
				return;
		}
	}

	// async shouldUpdateRelationships(data: IUserRelationship[]) {
	// 	if (this.state.list.length != data.length) {
	// 		return true;
	// 	}
	// 	let shouldUpdate = false;
	// 	data.map((elem) => {
	// 		let inf = (Number(elem.user1_id) === Number("1"));
	// 		let relationId = inf ? elem.user2_id : elem.user1_id;
	// 		if (this.state.list.findIndex((relation) => ( Number(relation.id) === Number(relationId) )) === -1) {
	// 			shouldUpdate = true;
	// 		}
	// 	})
	// 	return shouldUpdate;
	// }

	async setAllRelationships() {
		try {
			const dataRel = await axios.get("/api/users/relationships/" + "1")	// A CHANGER quand on aura l e bon id
			// if (this.shouldUpdateRelationships(dataRel.data)) {
				let a = this.state.list.slice();
				await dataRel.data.map(async (relation: IUserRelationship) => {
					let inf = (Number(relation.user1_id) === Number("1"));
					let friendId = inf ? relation.user2_id : relation.user1_id;

					console.log("friendId: " + friendId);

					try {
						let index = a.findIndex((elem) => (Number(elem.id) === Number(friendId)));
						if (index === -1) {
							const dataUser = await axios.get("/api/users/" + friendId);	// many api calls
							index = a.push(dataUser.data);
							a[index - 1].relationshipType = relation.type;
							this.setState({ list: a });
						} else {
							a[index].relationshipType = relation.type;
							this.setState({ list: a });
						}
					} catch (error) { }
				})
			// }
		} catch (error) { }
	}

	displayPendingRequests(relation: IUserInterface) {
		let inf = (Number("1") < Number(relation.id));
		if (((inf && (relation.relationshipType & UserRelationshipTypes.pending_second_first)) ||	// a ajuster
			(!inf && (relation.relationshipType & UserRelationshipTypes.pending_first_second))) &&
			this.state.displaySection.offlineFriends) {
			return (
				<FriendItem name={relation.name} status={relation.status} />
			)
		}
		else { return (<div></div>) }
	}

	displayInGameFriends(relation: IUserInterface) {
		if ((relation.relationshipType & UserRelationshipTypes.pending_first_second) &&	// a ajuster
			(relation.relationshipType & UserRelationshipTypes.pending_second_first) &&
			(relation.status === "In game") &&
			this.state.displaySection.inGameFriends) {
			return (
				<FriendItem name={relation.name} status={relation.status} />
			)
		}
		else { return (<div></div>) }
	}

	displayOnlineFriends(relation: IUserInterface) {
		if ((relation.relationshipType & UserRelationshipTypes.pending_first_second) &&	// a ajuster
			(relation.relationshipType & UserRelationshipTypes.pending_second_first) &&
			(relation.status === "Connected") &&
	this.state.displaySection.onlineFriends) {
			return (
				<FriendItem name={relation.name} status={relation.status} />
			)
		}
		else { return (<div></div>) }
	}

	displayofflineFriends(relation: IUserInterface) {
		if ((relation.relationshipType & UserRelationshipTypes.pending_first_second) &&	// a ajuster
			(relation.relationshipType & UserRelationshipTypes.pending_second_first) &&
			(relation.status === "Offline") &&
			this.state.displaySection.offlineFriends) {
			return (
				<FriendItem name={relation.name} status={relation.status} />
			)
		}
		else { return (<div></div>) }
	}

	render() {
		return (
			<aside className='bg-neutral'>
				<header>
					<h2 className="py-4 text-2xl text-center first-letter:uppercase bg-secondary">
						my friendlist
					</h2>
					<Link to='/users/find'>
						<button className="flex items-center justify-between w-full p-2 pl-8 text-left " type="button">
							<i className="fas fa-plus text-secondary" />
							<span className="flex-grow text-xl text-center first-letter:uppercase">
								add friends
						</span>
						</button>
					</Link>
				</header>
				<section>
					<button className="flex items-center justify-between w-full px-6 py-2 bg-neutral-dark" onClick={() => this.changeSectionDisplayStatus("pendingRequests")}>
						<i className={"fas " + (this.state.displaySection.pendingRequests ? "fa-chevron-down" : "fa-chevron-right")}></i>
						<h3 className="text-lg text-center first-letter:uppercase">
							friends requests
						</h3>
					</button>
					<ul>
						{this.state.list.map((relation) =>
							this.displayPendingRequests(relation)
						)}
					</ul>
				</section>
				<section>
					<button className="flex items-center justify-between w-full px-6 py-2 bg-neutral-dark" onClick={() => this.changeSectionDisplayStatus("inGameFriends")}>
						<i className={"fas " + (this.state.displaySection.inGameFriends ? "fa-chevron-down" : "fa-chevron-right")}></i>
						<h3 className="text-lg text-center first-letter:uppercase">
							In game friends
						</h3>
					</button>
					<ul>
						{this.state.list.map((relation) =>
							this.displayInGameFriends(relation)
						)}
					</ul>
				</section>
				<section>
					<button className="flex items-center justify-between w-full px-6 py-2 bg-neutral-dark" onClick={() => this.changeSectionDisplayStatus("onlineFriends")}>
						<i className={"fas " + (this.state.displaySection.onlineFriends ? "fa-chevron-down" : "fa-chevron-right")}></i>
						<h3 className="text-lg text-center first-letter:uppercase">
							Online friends
						</h3>
					</button>
					<ul>
						{this.state.list.map((relation) =>
							this.displayOnlineFriends(relation)
						)}
					</ul>
				</section>
				<section>
					<button className="flex items-center justify-between w-full px-6 py-2 bg-neutral-dark" onClick={() => this.changeSectionDisplayStatus("offlineFriends")}>
						<i className={"fas " + (this.state.displaySection.offlineFriends ? "fa-chevron-down" : "fa-chevron-right")}></i>
						<h3 className="text-lg text-center first-letter:uppercase">
							Offline friends
						</h3>
					</button>
					<ul>
						{this.state.list.map((relation) =>
							this.displayofflineFriends(relation)
						)}
					</ul>

				</section>
			</aside>
		);
	}
}
export default FriendsBar;