import { FaGithub, FaDev, FaLinkedin, FaQuora, FaTwitter, FaMedium } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const siteConfig = {
  copyright: `Copyright © ${new Date().getFullYear()} Thuta Min Thway. All Rights Reserved.`,
  author: {
    name: 'Thuta Min Thway',
    accounts: [
      {
        url: 'https://github.com/thuta21',
        label: 'Github Account',
        type: 'gray',
        icon: <FaGithub />
      },
      {
        url: 'https://x.com/Thuta952425',
        label: 'Twitter Account',
        type: 'twitter',
        icon: <FaTwitter />
      },
      {
        url: 'https://dev.to/thuta21',
        label: 'Dev Account',
        type: 'gray',
        icon: <FaDev />
      },
      {
        url: 'https://medium.com/@thutaminthway.dev',
        label: 'Medium Account',
        type: 'gray',
        icon: <FaMedium />
      },
      {
        url: 'https://www.linkedin.com/in/thuta-min-thway-72a849226/',
        label: 'LinkedIn Account',
        type: 'linkedin',
        icon: <FaLinkedin />
      },
      {
        url: 'mailto:thutaminthway.dev@gmail.com',
        label: 'Mail ahmad',
        type: 'gray',
        icon: <FiMail />
      }
    ]
  }
};

export default siteConfig;
