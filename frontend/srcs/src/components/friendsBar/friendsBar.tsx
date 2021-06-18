import React from 'react';
import FriendItem from './friendsItem';

class FriendsBar extends React.Component {

	render(){
		return (
			<aside className='bg-neutral'>
				<header>
					<h2 className="text-2xl text-center first-letter:uppercase">my friendlist</h2>
					<button className="flex justify-between w-full px-8 py-4 text-left ">
						<i className="fas fa-plus"/>
						<span className="first-letter:uppercase">
							add friends
						</span>
					</button>
				</header>
				<section>
					<button className="flex items-center justify-between w-full px-8 py-4">
						<i className="items-center fas fa-chevron-down"></i>
						<h3 className="text-xl text-center first-letter:uppercase">
							pending requests
						</h3>
					</button>
					<ul>
						<li>

						</li>
					</ul>
				</section>
				<section>
					<button className="flex items-center justify-between w-full px-8 py-4">
						<i className="items-center fas fa-chevron-down"></i>
						<h3 className="text-xl text-center first-letter:uppercase">
							online friends
						</h3>
					</button>
					<ul>
						<FriendItem name="friends 1" status="online"/>
						<FriendItem name="friends 2" status="ingame"/>
					</ul>
				</section>
				<section>
					<button className="flex items-center justify-between w-full px-8 py-4">
						<i className="items-center fas fa-chevron-down"></i>
						<h3 className="text-xl text-center first-letter:uppercase">
							offline friends
						</h3>
					</button>
					<ul>
						<FriendItem name="friends 2" status="offline"/>
					</ul>

				</section>
			</aside>
		);
	}
}
export default FriendsBar;