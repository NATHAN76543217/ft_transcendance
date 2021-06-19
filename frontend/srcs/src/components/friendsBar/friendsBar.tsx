import React from 'react';
import FriendItem from './friendsItem';

class FriendsBar extends React.Component {

	render(){
		return (
			<aside className='bg-neutral'>
				<header>
					<h2 className="py-4 text-2xl text-center first-letter:uppercase bg-secondary">
						my friendlist
					</h2>
					<button className="flex items-center justify-between w-full p-2 pl-8 text-left ">
						<i className="fas fa-plus text-secondary"/>
						<span className="flex-grow text-xl text-center first-letter:uppercase">
							add friends
						</span>
					</button>
				</header>
				<section>
					<button className="flex items-center justify-between w-full px-6 py-2 bg-neutral-dark">
						<i className="fas fa-chevron-down"></i>
						<h3 className="text-lg text-center first-letter:uppercase">
							friends requests
						</h3>
					</button>
					<ul>
						<FriendItem name="friends 0" status="ingame"/>
					</ul>
				</section>
				<section>
					<button className="flex items-center justify-between w-full px-6 py-2 bg-neutral-dark">
						<i className="fas fa-chevron-down"></i>
						<h3 className="text-lg text-center first-letter:uppercase">
							online friends
						</h3>
					</button>
					<ul>
						<FriendItem name="friends 1" status="online"/>
						<FriendItem name="friends 2" status="ingame"/>
					</ul>
				</section>
				<section>
					<button className="flex items-center justify-between w-full px-6 py-2 bg-neutral-dark">
						<i className="fas fa-chevron-down"></i>
						<h3 className="text-lg text-center first-letter:uppercase">
							offline friends
						</h3>
					</button>
					<ul>
						<FriendItem name="friends 3" status="offline"/>
					</ul>

				</section>
			</aside>
		);
	}
}
export default FriendsBar;