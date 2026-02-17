const defaultData = {
    details: {
        name: "EnuX",
        fullName: "Enuka Geenad",
        email: "hello@enux.com",
        phone: "+94 77 123 4567",
        bio: "Creative Developer & Music Producer based in the digital realm. Blending code and sound to create immersive experiences.",
        aboutFull: "I am a passionate creator working at the intersection of technology and art. With a background in software engineering and a love for music production, I build modern web applications and compose electronic soundscapes.",
        qualifications: [
            "BSc in Computer Science",
            "Certified Music Producer",
            "Full Stack Web Developer Certification"
        ],
        skills: ["Web Development", "Music Production", "Linux Administration", "UI/UX Design", "Sound Design", "Python", "JavaScript"],
        heroVideo: "https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-connection-lines-28266-large.mp4"
    },
    socials: [
        { platform: "Facebook", url: "#" },
        { platform: "YouTube", url: "#" },
        { platform: "Instagram", url: "#" },
        { platform: "TikTok", url: "#" },
        { platform: "X", url: "#" },
        { platform: "LinkedIn", url: "#" },
        { platform: "Linux", url: "#" }
    ],
    songs: [
        { id: 1, title: "Neon Horizon", cover: "https://via.placeholder.com/300/6c5ce7/ffffff?text=Neon+Horizon", links: { spotify: "#", apple: "#", youtube: "#" } },
        { id: 2, title: "Cyber Dreams", cover: "https://via.placeholder.com/300/00cec9/ffffff?text=Cyber+Dreams", links: { spotify: "#", apple: "#", youtube: "#" } },
        { id: 3, title: "Midnight Code", cover: "https://via.placeholder.com/300/fd79a8/ffffff?text=Midnight+Code", links: { spotify: "#", apple: "#", youtube: "#" } },
        { id: 4, title: "System Glitch", cover: "https://via.placeholder.com/300/ffeaa7/000000?text=System+Glitch", links: { spotify: "#", apple: "#", youtube: "#" } }
    ],
    videos: {
        enux: [
            { id: 1, title: "Satisfactory Liveවල මොකද උනේ? | satisfactory Recap 01", url: "https://www.youtube.com/embed/RTYYQRUbN1Y" },
            { id: 2, title: "Valorant Replication ගහමුද...? | Sova vs Neon replication", url: "https://www.youtube.com/embed/ZA7gYXrwpnA" }
        ],
        diary: [
            { id: 101, title: "Trip 02 Ep. 02 | Yala Safari | Ondaatje Bungalow | ft. Sibs", url: "https://www.youtube.com/embed/7OEpYuZowXk" },
            { id: 102, title: "Trip 02 Ep. 01 | නොදකින සතුන් එළිමහනේ දකින Ridiyagama Safari Park | ft. Sibs", url: "https://www.youtube.com/embed/FR1zDqqPT1U" }
        ]
    }
};

// Initialize Data
if (!localStorage.getItem('site_data')) {
    localStorage.setItem('site_data', JSON.stringify(defaultData));
}

let data = JSON.parse(localStorage.getItem('site_data'));

// Migration: Fix videos structure if it's the old array format
if (Array.isArray(data.videos)) {
    data.videos = defaultData.videos;
    localStorage.setItem('site_data', JSON.stringify(data));
}

// Migration: Add email/phone/video if missing
let needsUpdate = false;
if (!data.details.email) {
    data.details.email = defaultData.details.email;
    data.details.phone = defaultData.details.phone;
    needsUpdate = true;
}
if (!data.details.heroVideo) {
    data.details.heroVideo = defaultData.details.heroVideo;
    needsUpdate = true;
}

if (needsUpdate) {
    localStorage.setItem('site_data', JSON.stringify(data));
}

// DOM Elements & Rendering
document.addEventListener('DOMContentLoaded', () => {

    // --- Page Specific Logic ---
    if (document.getElementById('home-page')) renderHome();
    if (document.getElementById('music-page')) renderMusic();
    if (document.getElementById('about-page')) renderAbout();
    if (document.getElementById('admin-page')) initAdmin();

    updateGlobalDetails();
});

function updateGlobalDetails() {
    // Update elements that appear on multiple pages if they exist
    const nameEls = document.querySelectorAll('.display-name');
    nameEls.forEach(el => el.textContent = data.details.name);

    const fullNameEls = document.querySelectorAll('.display-fullname');
    fullNameEls.forEach(el => el.textContent = data.details.fullName);

    // Social Links
    const socialContainers = document.querySelectorAll('.social-links-container, .social-links');
    socialContainers.forEach(container => {
        container.innerHTML = data.socials.map(s => `
            <a href="${s.url}" target="_blank" class="social-icon" title="${s.platform}">
                <i class="fab fa-${getIconClass(s.platform)}"></i>
            </a>
        `).join('');
    });
}

function getIconClass(platform) {
    const p = platform.toLowerCase();
    if (p === 'x') return 'twitter';
    if (p === 'linux') return 'linux';
    if (p === 'tiktok') return 'tiktok';
    if (p === 'facebook') return 'facebook-f';
    if (p === 'youtube') return 'youtube';
    if (p === 'instagram') return 'instagram';
    if (p === 'linkedin') return 'linkedin-in';
    return Object.keys(data.socials).find(k => k === p) ? p : 'globe';
}

function renderHome() {
    // Bio
    const bioShort = document.getElementById('bio-short');
    if (bioShort) bioShort.textContent = data.details.bio;

    // Hero Video Logic
    const heroContainer = document.querySelector('.hero-video-container');
    const videoUrl = data.details.heroVideo;

    if (heroContainer && videoUrl) {
        // Check if YouTube (Supports standard, shorten, shorts, and ?si= params)
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const ytMatch = videoUrl.match(youtubeRegex);

        if (ytMatch && ytMatch[1]) {
            const videoId = ytMatch[1];
            // Uses youtube-nocookie and no-referrer policy to bypass some origin restrictions
            const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1`;

            heroContainer.innerHTML = `<iframe 
                src="${embedUrl}" 
                frameborder="0" 
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture" 
                referrerpolicy="no-referrer"
                allowfullscreen 
                style="width: 100%; height: 100%; pointer-events: none;"></iframe>`;
        } else {
            // Assume direct link
            heroContainer.innerHTML = `<video src="${videoUrl}" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>`;
        }
    }

    // Last 3 Songs
    const recentSongs = data.songs.slice(0, 3);
    const musicGrid = document.getElementById('home-music-grid');
    if (musicGrid) {
        musicGrid.innerHTML = recentSongs.map(song => createSongCard(song)).join('');
    }

    // EnuX Videos
    const enuxGrid = document.getElementById('enux-video-grid');
    if (enuxGrid && data.videos.enux) {
        enuxGrid.innerHTML = data.videos.enux.slice(0, 2).map(vid => createVideoCard(vid)).join('');
    }

    // Diary Videos
    const diaryGrid = document.getElementById('diary-video-grid');
    if (diaryGrid && data.videos.diary) {
        diaryGrid.innerHTML = data.videos.diary.slice(0, 2).map(vid => createVideoCard(vid)).join('');
    }
}

function renderMusic() {
    const musicGrid = document.getElementById('all-music-grid');
    if (musicGrid) {
        musicGrid.innerHTML = data.songs.map(song => createSongCard(song)).join('');
    }
}

function renderAbout() {
    const aboutFull = document.getElementById('about-full');
    if (aboutFull) aboutFull.textContent = data.details.aboutFull;

    const qualList = document.getElementById('qualifications-list');
    if (qualList) {
        qualList.innerHTML = data.details.qualifications.map(q => `<li>${q}</li>`).join('');
    }

    const skillList = document.getElementById('skills-list');
    if (skillList) {
        skillList.innerHTML = data.details.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    }

    // Contact Info
    const contactContainer = document.getElementById('contact-info');
    if (contactContainer) {
        contactContainer.innerHTML = `
            ${data.details.email ? `
                <div style="display: flex; align-items: center; gap: 10px; font-size: 1.1rem;">
                    <i class="fas fa-envelope" style="color: var(--primary-color);"></i>
                    <a href="mailto:${data.details.email}">${data.details.email}</a>
                </div>` : ''}
            
            ${data.details.phone ? `
                <div style="display: flex; align-items: center; gap: 10px; font-size: 1.1rem;">
                    <i class="fas fa-phone" style="color: var(--primary-color);"></i>
                    <a href="tel:${data.details.phone.replace(/\s+/g, '')}">${data.details.phone}</a>
                </div>` : ''}
        `;
    }
}

function createSongCard(song) {
    return `
        <div class="glass-card music-card">
            <div class="album-art">
                <img src="${song.cover}" alt="${song.title}">
            </div>
            <h3>${song.title}</h3>
            <div class="streaming-links">
                ${song.links.spotify ? `<a href="${song.links.spotify}" class="small-btn">Spotify</a>` : ''}
                ${song.links.apple ? `<a href="${song.links.apple}" class="small-btn">Apple</a>` : ''}
                ${song.links.youtube ? `<a href="${song.links.youtube}" class="small-btn">YouTube</a>` : ''}
            </div>
        </div>
    `;
}

function createVideoCard(video) {
    const watchUrl = video.url.replace('embed/', 'watch?v=');
    return `
        <div class="glass-card">
            <div class="video-container">
                <iframe src="${video.url}" title="${video.title}" allowfullscreen></iframe>
            </div>
            <h3 style="margin-top: 1rem;"><a href="${watchUrl}" target="_blank" style="text-decoration: none; color: inherit;">${video.title}</a></h3>
        </div>
    `;
}

// --- Admin Logic ---
function initAdmin() {
    const loginOverlay = document.getElementById('admin-login');
    const dashboard = document.getElementById('admin-dashboard');
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('admin-pass');

    // Populate Forms
    if (document.getElementById('detail-bio')) {
        document.getElementById('detail-bio').value = data.details.bio || '';
        document.getElementById('detail-fullname').value = data.details.fullName || '';
        document.getElementById('detail-email').value = data.details.email || '';
        document.getElementById('detail-phone').value = data.details.phone || '';
        document.getElementById('detail-hero-video').value = data.details.heroVideo || '';
        document.getElementById('detail-about-full').value = data.details.aboutFull || '';
        document.getElementById('detail-qualifications').value = (data.details.qualifications || []).join('\n');
        document.getElementById('detail-skills').value = (data.details.skills || []).join(', ');

        renderAdminSongList();
    }

    // Simple Check
    loginBtn.addEventListener('click', () => {
        if (passInput.value === 'admin123') {
            loginOverlay.classList.add('hidden');
            dashboard.classList.remove('hidden');
        } else {
            alert('Access Denied');
        }
    });

    // Add Song
    const addSongForm = document.getElementById('add-song-form');
    if (addSongForm) {
        addSongForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSong = {
                id: Date.now(),
                title: document.getElementById('song-title').value,
                cover: document.getElementById('song-cover').value || 'https://via.placeholder.com/300',
                links: {
                    spotify: document.getElementById('song-spotify').value,
                    apple: document.getElementById('song-apple').value,
                    youtube: document.getElementById('song-youtube').value,
                }
            };
            data.songs.unshift(newSong);
            saveData();
            renderAdminSongList(); // Refresh list
            alert('Song Added!');
            e.target.reset();
        });
    }

    // Add Social Link
    const addSocialForm = document.getElementById('add-social-form');
    if (addSocialForm) {
        addSocialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const platform = document.getElementById('social-platform').value;
            const url = document.getElementById('social-url').value;

            // Check if exists
            const existing = data.socials.find(s => s.platform === platform);
            if (existing) {
                existing.url = url;
            } else {
                data.socials.push({ platform, url });
            }
            saveData();
            alert('Social Link Updated!');
            e.target.reset();
        });
    }

    // Update Profile Details
    const updateDetailsForm = document.getElementById('update-details-form');
    if (updateDetailsForm) {
        updateDetailsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            data.details.fullName = document.getElementById('detail-fullname').value;
            data.details.email = document.getElementById('detail-email').value;
            data.details.phone = document.getElementById('detail-phone').value;
            data.details.heroVideo = document.getElementById('detail-hero-video').value;
            data.details.bio = document.getElementById('detail-bio').value;
            data.details.aboutFull = document.getElementById('detail-about-full').value;

            // Qualifications
            const qualText = document.getElementById('detail-qualifications').value;
            data.details.qualifications = qualText.split('\n').map(s => s.trim()).filter(s => s);

            // Skills
            const skillsText = document.getElementById('detail-skills').value;
            data.details.skills = skillsText.split(',').map(s => s.trim()).filter(s => s);

            saveData();
            alert('Profile Details Updated!');
        });
    }

    // Upload CV
    const uploadCvForm = document.getElementById('upload-cv-form');
    if (uploadCvForm) {
        uploadCvForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('CV "Uploaded"! (This is a demo, file path would be saved here)');
            // Mock logic:
            // data.details.cv = "path/to/cv"; saveData();
        });
    }
}

function renderAdminSongList() {
    const listContainer = document.getElementById('admin-song-list');
    if (!listContainer) return;

    listContainer.innerHTML = data.songs.map(song => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 10px; margin-bottom: 8px; border-radius: 5px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${song.cover}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                <span>${song.title}</span>
            </div>
            <button onclick="window.deleteSong(${song.id})" class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: #e50914;">Remove</button>
        </div>
    `).join('');
}

// Global scope for onclick access (simplistic approach)
window.deleteSong = function (id) {
    if (confirm('Are you sure you want to delete this song?')) {
        data.songs = data.songs.filter(s => s.id !== id);
        saveData();
        renderAdminSongList();
        alert('Song removed.');
    }
};

function saveData() {
    localStorage.setItem('site_data', JSON.stringify(data));
    // Optional: Update displayed elements immediately if needed
}
