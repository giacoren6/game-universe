# Game-Universe

Game Universe is a responsive front-end e-commerce website developed using HTML5, CSS3 and JavaScript. The main idea of the project was to create a modern gaming store where users can explore different games and interact with the website in a simple and realistic way.

The website allows users to browse a collection of games, search for a specific title and filter products by platform. Each game is displayed inside a product card that includes an image, name, category, price and an Add to Cart button. This makes the product information easy to understand and helps users quickly find the games they are interested in.

The shopping cart was created using JavaScript. When a user adds a game, JavaScript updates the cart without reloading the page. Users can increase or decrease the quantity, remove products and view the total price automatically. The cart information is also saved using Local Storage, which means the selected items can remain in the cart even when the page is refreshed.

The website includes a responsive navigation bar that changes into a mobile menu on smaller screens. CSS Grid, Flexbox and media queries were used to make the layout work correctly on desktop, tablet and mobile devices. Images, videos, buttons, product cards and text sections resize and reposition depending on the screen size.

Game Universe also includes separate Home, Games, About and Contact pages. The Home page introduces the website through a hero video and featured games. The Games page contains the full product collection, search system, platform filters and shopping cart. The About page explains the purpose, mission and values of the website. The Contact page includes a form with client-side validation and a success notification after submission.

Other interactive features include toast notifications, active navigation links, hover effects, animated buttons, a mobile hamburger menu and a simulated checkout confirmation. These features were added to improve the user experience and make the website feel more complete.

Accessibility was also considered during development. The website uses semantic HTML elements, form labels, alternative text for images, clear colour contrast and visible focus states for keyboard users. The pages were designed to be easy to navigate and understandable for different users.

This website was developed for the Web Development module and demonstrates my understanding of responsive web design, HTML structure, CSS styling, JavaScript DOM manipulation, Local Storage, accessibility and basic user experience principles.

Welcome to [Game Universe](https://giacoren6.github.io/game-universe/index.html)


<img width="1829" height="965" alt="Screenshot 2026-07-23 at 13 18 50" src="https://github.com/user-attachments/assets/ec7c4f35-e068-4e2b-bf0b-9782ee04c23d" />


## User Experience

### Website Goals

The aim of Game Universe is to provide users with a modern online gaming store where they can:

- Browse games
- Search products
- Filter by platform
- Manage a shopping cart
- Being responsive on every device

## Design

The design of Game Universe was created to give the website a modern and immersive gaming style. I used a consistent dark colour theme across all pages, with dark navy backgrounds, purple highlights and white text. The main colours include dark blue such as #080b16 and #0b1020, purple such as #a855f7, and white for important headings and content. The purple colour is used for buttons, active navigation links, labels, borders and hover effects so that the website keeps the same visual identity throughout.

Images and videos are used in almost every main section to make the website more engaging. The Home page begins with a large background video that immediately introduces the gaming theme. The About section includes a controller video inside a circular frame with a purple glow effect. The About, Games and Contact pages also use large background images in their hero sections. These images help users understand the purpose of each page before reading the content.

The product sections use gaming cover images inside the product cards. Each card contains an image, game title, category, platform, description, price and Add to Cart button. Shadows, rounded corners, borders and hover animations were added to make the cards feel interactive. When users move the mouse over a product card, the card moves slightly upwards and the image enlarges, helping users see which product they are selecting.

A dark transparent overlay is placed over the hero images and videos. This reduces the brightness of the background and allows the white text and purple buttons to remain readable. The hero content is positioned in the centre of the section so that the main title, description and buttons are immediately visible.

Spacing and alignment were kept consistent by using CSS Grid and Flexbox. These tools helped organise the navigation bar, product grids, service cards, forms, footer and shopping cart. Rounded buttons and smooth hover transitions are used across the website to create a consistent user experience.

The layout was also designed to be responsive. On desktop screens, sections can use multiple columns, while tablets and mobile devices display fewer columns or a single-column layout. Images, videos, text and buttons resize or reposition depending on the screen width. The navigation bar changes into a hamburger menu on smaller devices, and the shopping cart adjusts its width to fit mobile screens.

Overall, the combination of videos, gaming images, dark backgrounds, purple highlights, animations and responsive layouts was chosen to make Game Universe look professional, modern and suitable for an online gaming store.

# Features

## Home Page

The Home page is the first page users see when visiting the website. It was designed to immediately introduce the gaming theme through a full-screen hero video, bold headings and call-to-action buttons.

The page includes a responsive navigation bar, featured games, an About preview and a services section that explains what the website offers. Smooth scrolling, hover animations and responsive layouts improve the browsing experience and encourage users to continue exploring the website.

- Responsive navigation bar
- Background video
- Featured games section
- About preview
- Services section
- Call to action buttons
- Footer with useful links

<img width="1906" height="976" alt="Screenshot 2026-07-23 at 13 49 32" src="https://github.com/user-attachments/assets/132eba4a-8ec5-4fe6-943d-1fe46da35268" />

<img width="1900" height="600" alt="Screenshot 2026-07-23 at 13 49 56" src="https://github.com/user-attachments/assets/2d54100a-4c7f-4f07-8916-79d404bea86f" />

<img width="1886" height="983" alt="Screenshot 2026-07-23 at 13 50 07" src="https://github.com/user-attachments/assets/9caae4ea-7c2e-49db-8f78-261eeb891fc5" />

<img width="1895" height="986" alt="Screenshot 2026-07-23 at 13 50 15" src="https://github.com/user-attachments/assets/532d95ab-221f-4666-882a-0a9a853aa250" />



## Games Page

The Games page acts as the main product catalogue of the website. It displays a collection of games presented as interactive product cards containing the game image, title, platform, category, description and price.

Users can search for games using the search bar or filter the collection by platform. Every product can be added directly to the shopping cart without refreshing the page thanks to JavaScript.

- Game products
- Product cards
- Search functionality
- Platform filters
- Add to Cart buttons
- Responsive product grid
- Interactive hover effects


<img width="1896" height="688" alt="Screenshot 2026-07-23 at 14 00 10" src="https://github.com/user-attachments/assets/587bba1b-7c7c-465c-a55c-f6a1d7b3ff2c" />

<img width="1898" height="885" alt="Screenshot 2026-07-23 at 14 00 30" src="https://github.com/user-attachments/assets/db20d575-9ca8-483a-9f6d-dc349a1b383d" />

<img width="1882" height="780" alt="Screenshot 2026-07-23 at 14 00 59" src="https://github.com/user-attachments/assets/08739d8f-a50e-4b84-ab22-f96fd0987faa" />


## Shopping Cart

The shopping cart was developed entirely using JavaScript and Local Storage. It allows users to manage their selected products in a realistic way without requiring a backend implementations.

Whenever a product is added, removed or updated, the cart automatically recalculates the total price and refreshes the displayed information. The cart is also saved in Local Storage, allowing products to remain available even after refreshing the page.


- Add products
- Remove products
- Increase quantity
- Decrease quantity
- Automatic total calculation
- Local Storage persistence
- Checkout simulation
- Purchase notification

<img width="1917" height="989" alt="Screenshot 2026-07-23 at 14 16 12" src="https://github.com/user-attachments/assets/83e06cde-7f0d-4ae8-8740-aa5258bb3f9b" />

<img width="1920" height="989" alt="Screenshot 2026-07-23 at 14 16 27" src="https://github.com/user-attachments/assets/6afd3572-3501-44ca-b13a-db367d0431de" />

<img width="1893" height="986" alt="Screenshot 2026-07-23 at 14 16 35" src="https://github.com/user-attachments/assets/37017773-2341-4181-bec0-6c1901c7e0a8" />


## About Page

The About page introduces the purpose of Game Universe and provides that users visit with more information regarding the website. It explains the website's mission, vision and values while maintaining the same gaming style used throughout the rest of the website.

The page combines large background images, videos, cards and animations to create a visually engaging experience while remaining responsive on different screen sizes.

- Hero banner
- Mission section
- Vision and values
- Controller video
- Animated cards
- Responsive layout


<img width="2940" height="1356" alt="Screenshot 2026-07-23 at 16 50 15" src="https://github.com/user-attachments/assets/dc6c1ff6-79b2-48cf-b744-52b643b6c05c" />

<img width="2940" height="1230" alt="Screenshot 2026-07-23 at 16 50 22" src="https://github.com/user-attachments/assets/609fafa5-1647-4ac3-b781-f569b09dc74a" />

<img width="2940" height="1092" alt="Screenshot 2026-07-23 at 16 50 39" src="https://github.com/user-attachments/assets/8d601da8-a4b0-40a3-957e-7f5ba5566e66" />


<img width="2940" height="909" alt="Screenshot 2026-07-23 at 16 51 02" src="https://github.com/user-attachments/assets/78ea7f67-098a-439c-84a6-e68aa3926f82" />


<img width="2940" height="1400" alt="Screenshot 2026-07-23 at 16 51 09" src="https://github.com/user-attachments/assets/82184205-9d10-497f-bc47-4d5f554a2147" />


## Contact Page

The Contact page allows users to send enquiries through a contact form. Client-side JavaScript validation checks that all required information has been completed before allowing the form to be submitted.

After submission, the user receives a success message and notification to confirm that the demonstration form has been completed successfully.

The page also includes contact information, social media links and a Frequently Asked Questions section to improve the user experience.


- Contact form
- Form validation
- Success notification
- Contact information
- Social media buttons
- FAQ section
- Responsive interface

<img width="2940" height="1338" alt="Screenshot 2026-07-23 at 16 59 05" src="https://github.com/user-attachments/assets/2702efea-4365-454c-adb8-bb2c44833b4e" />

<img width="2940" height="1645" alt="Screenshot 2026-07-23 at 16 59 26" src="https://github.com/user-attachments/assets/f2d106bb-3964-44a0-aa03-95473a58668b" />

<img width="2940" height="922" alt="Screenshot 2026-07-23 at 16 59 33" src="https://github.com/user-attachments/assets/4bfb689b-9d7d-4789-9e4a-096ca9b1e91e" />

<img width="2940" height="1385" alt="Screenshot 2026-07-23 at 16 59 40" src="https://github.com/user-attachments/assets/7214189d-2781-4989-abc2-8ddcac9f2ca8" />


# Responsive Design 

Game Universe was designed to work on desktop, tablet and mobile devices. I used CSS Grid, Flexbox and media queries to adjust the layout depending on the screen size.

## Desktop

On larger screens, the website uses multiple columns. Product cards display three per row, and sections such as About use text and images side by side.

### Tablets — 900px and smaller

At 900px, the main sections change into fewer columns. Product cards and service cards display two per row, while the About and Contact sections move into a single-column layout.

### Small tablets — 768px and smaller

At 768px, the normal navigation changes into a hamburger menu. The hero buttons move into a vertical layout, and the header, logo and cart button become smaller.

### Mobile phones — 600px and smaller

At 600px, most sections display one item per row. Product cards, forms, footer links and service cards become full width. Headings, images, videos and spacing also become smaller to fit mobile screens.

The hero videos and background images use object-fit: cover and background-size: cover, while their positions are adjusted so the important parts remain visible.

The shopping cart also changes size depending on the device. It appears as a side panel on desktop and becomes wider or full screen on smaller phones.

I tested the website using Chrome DevTools at different screen sizes to ensure that the navigation, products, forms, images, videos and shopping cart work correctly on every device.

