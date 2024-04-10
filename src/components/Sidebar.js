import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import "../style/Sidebar.css";
import * as BiIcons from 'react-icons/bi';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import Login from './Login';
import { Cookies } from 'react-cookie';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false
		}
		const { setToken } = this.props;
		const cookies = new Cookies();
		setToken(cookies.get('token'));
	}

	render() {
		const { children, token, setToken } = this.props;

		const logoff = () =>{
			if (window.confirm('Do you want to logoff?')) {
				const cookies = new Cookies();
				cookies.set('token', '');
				setToken('');
				window.location.reload();
			}
		}

		const menuItems = [
			{
				text: "Home",
				path: '/',
				icon: <HomeIcon fontSize='large' />,
			},
			{
				text: "Devices",
				path: '/devices',
				icon: <MemoryIcon fontSize='large' />,
			},
			{
				text: "Apps",
				path: '/appIds',
				icon: <AppRegistrationIcon fontSize='large' />,
			},
			{
				text: "Settings",
				path: '/settings',
				icon: <SettingsIcon fontSize='large' />,
			},
		];
		return (
			<div>
				{token === '' ?
					(
						<Login setToken={setToken} />
					) :
					(
						<div className='container'>
							<div
								className={
									this.state.isExpanded
										? "sidebar-container"
										: "sidebar-container sidebar-container-out"
								}
								onMouseLeave={() => this.setState({ isExpanded: false })}
							>
								<div className="nav-upper">
									<div className="nav-heading">
										<img className="logo" src="icons/io7lab-7.png" width="40" alt="" srcSet=""
											onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}
											onMouseOver={() => this.setState({ isExpanded: true })}
										/>
										{this.state.isExpanded && <p className="nav-heading-title">io7 Device Console</p>}
									</div>
								</div>
								<div className="nav-menu">
									{menuItems.map(({ text, icon, path }) => (
										<NavLink to={path} key={text} id={'side-'+text} className="menu-item">
											<div className='menu-item-icon'>{icon}</div>
											{this.state.isExpanded && <div className='menu-item-text'>{text}</div>}
										</NavLink>
									))}
									<div className="nav-footer" onClick={() => logoff()}>
										<div className='logout-icon'><BiIcons.BiLogOutCircle /></div>
									</div>
								</div>
							</div>
							<div className="children-container">{children}</div>
						</div>
					)
				}
			</div>
		);
	}
};

export default Sidebar;
