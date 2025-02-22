

import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChatContext } from '../../../Services/Chat/Context';
import { CoreContext } from '../../../Services/Core/Context';
import { Tooltip } from '@mui/material';
import UseWindowSize from '../../../Hooks/UseWindowSize';
import SettingsMenu from '../../Chat/SettingsMenu';
import Fade from 'react-reveal/Fade';
import MenuIcon from '../MenuIcon';
import MobileActivityMenu from '../../Chat/MobileActivityMenu';
import LanguageSelect from '../LanguageSelect';
import EllaAnimation from '../EllaAnimation';
import './Layout.css';
import ScrollProgress from '../ScrollProgress';

const Layout = () => {
    const [GetIsMenuActive, SetIsMenuActive] = useState(false);
    const { Width } = UseWindowSize();
    const Navigate = useNavigate();
    const Location = useLocation();

    const { L, GetIsEllaAnimationEnabled } = useContext(CoreContext);
    const { UserExperience } = useContext(ChatContext);

    useEffect(() => {
        const Method = (UserExperience.GetIsSettingsMenuActive 
            || UserExperience.GetIsMobileActivityMenuActive) ? ('add') : ('remove');
        document.querySelector('#Ella-ROOT header')?.classList?.[Method]('Blurred-Box');
        document.querySelector('#Ella-ROOT main')?.classList?.[Method]('Blurred-Box');
    }, [UserExperience.GetIsSettingsMenuActive, UserExperience.GetIsMobileActivityMenuActive]);

    useEffect(() => {
        return () => {
            SetIsMenuActive(false);
        };
    }, []);

    return (GetIsEllaAnimationEnabled) ? (
        <EllaAnimation />
    ) : (
        <React.Fragment>
            {(Location.pathname !== '/' || (Location.pathname === '/' && Width <= 768)) && (
                <ScrollProgress />
            )}

            {(GetIsMenuActive && Width <= 768) && (
                <aside id='Mobile-Menu-Box'>
                    <article id='Mobile-Menu-Content-Box'>
                        <ul id='Mobile-Menu-Navegation-Box'>
                            {[
                                [L('MOBILE_MENU_TERMS_AND_PRIVACY'), () => Navigate('/about/')],
                                [L('MOBILE_MENU_DOCUMENTATION'), () => {}],
                                [L('MOBILE_MENU_LEGAL_NOTICE'), () => {}],
                                [L('MOBILE_MENU_SOURCE_CODE'), () => window.open(import.meta.env.VITE_SOFTWARE_REPOSITORY_LINK, 'blank')]
                            ].map(([ Title, OnClick ], Index) => (
                                <Fade {...{ [(Index % 2 === 0) ? 'right' : 'left']: true }} key={Index}>
                                    <li onClick={OnClick} className='Mobile-Menu-Content-Item-Box'>
                                        <span>{Title}</span>
                                    </li>
                                </Fade>
                            ))}
                        </ul>
                        
                        <Fade bottom>
                            <ul id='Mobile-Menu-External-References-Box'>
                                <button onClick={() => window.open(import.meta.env.VITE_GPT4FREE_LINK, '_blank')} className='Button Outlined No-BR'>GPT4FREE</button>
                                <LanguageSelect />
                            </ul>
                        </Fade>
                    </article>
                </aside>
            )}

            {(UserExperience.GetIsSettingsMenuActive) && <SettingsMenu />}
            {(UserExperience.GetIsMobileActivityMenuActive && Width <= 768) && <MobileActivityMenu />}
            
            <header id='Header' data-path={Location.pathname}>
                <article id='Brand-Box'>
                    <h3 id='Brand-Title' onClick={() => Navigate('/')}>{L('HEADER_TITLE')}</h3>
                </article>
                
                <article id='Navegation-Box'>
                    {(Width <= 768) ? (
                        <MenuIcon 
                            onClick={() => SetIsMenuActive(!GetIsMenuActive)} 
                            IsActive={GetIsMenuActive} />
                    ) : (
                        <Tooltip title={L('TOOLTIP_HEADER_ABOUT')}>
                            <a onClick={() => Navigate('/about')} className='Navegation-Item-Link Button Outlined No-BR'>{L('HEADER_ABOUT_BTN')}</a>
                        </Tooltip>
                    )}
                    <Tooltip title={L('TOOLTIP_HEADER_DONATE')}>
                        <a onClick={() => window.open(import.meta.env.VITE_DONATE_LINK, '_blank')} className='Navegation-Item-Link Button Outlined No-BR'>{L('HEADER_DONATE_BTN')}</a>
                    </Tooltip>
                    {(Width > 768) && <LanguageSelect />}
                </article>
            </header>
            
            <Fade clear>
                <Outlet />
            </Fade>
        </React.Fragment>  
    );
};

export default Layout;