# The Color Symphony - Art Gallery Website

A beautiful, responsive art gallery website to showcase paintings with aesthetic colors, animations, and a light theme. The website includes an admin panel for easy management.

## Features

### Front-End
- Responsive design that works on all devices
- Aesthetic light color scheme with purple accent colors
- Custom cursor animations and interactive elements
- Smooth scrolling and page transitions
- Image gallery with hover effects
- Contact form with validation
- Newsletter subscription
- Social media integration

### Admin Panel
- Secure login system
- Dashboard with analytics
- Painting management (add, edit, delete)
- Category management
- Inquiry management
- Subscriber list
- Website settings

## Technologies Used

- HTML5
- CSS3 with custom variables and animations
- Vanilla JavaScript
- Chart.js for analytics visualizations
- Font Awesome for icons
- Google Fonts (Playfair Display and Poppins)

## Getting Started

1. Clone the repository or download the files
2. Open `index.html` in your browser to view the website
3. To access the admin panel, click on the "Admin" link in the footer or navigate to `/admin/login.html`
4. Use the following credentials to log in:
   - Username: admin
   - Password: password

## File Structure

```
/
├── index.html              # Homepage
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── script.js           # Front-end JavaScript
├── images/                 # Image assets
├── admin/                  # Admin panel
│   ├── login.html          # Admin login page
│   ├── dashboard.html      # Admin dashboard
│   ├── admin.css           # Admin styles
│   └── admin.js            # Admin JavaScript
└── README.md               # Project documentation
```

## Customization

### Changing Colors
The color scheme can be easily modified by changing the CSS variables in the `:root` selector in `css/style.css`:

```css
:root {
    --primary-color: #f0e6ff;
    --secondary-color: #d8c2ff;
    --accent-color: #9c6dff;
    /* other color variables */
}
```

### Adding Paintings
To add new paintings to the gallery:

1. Add the image file to the `images/` directory
2. Use the admin panel painting management section, or
3. Manually update the gallery section in `index.html`

## Browser Support

The website works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is available for personal and commercial use.

## Credits

- Fonts from [Google Fonts](https://fonts.google.com/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Chart functionality from [Chart.js](https://www.chartjs.org/)

---

Created by [Your Name] for The Color Symphony. 