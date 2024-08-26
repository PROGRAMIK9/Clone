

let currentsong = new Audio();
let songs = [];
let thumb = [];
let pthumb = [];
let plays = []
let username = document.getElementById('profile-name').innerHTML || 'guest'
async function getPlaylist() {
    try {
        let response = await fetch(`/api/users/${username}`);
        let playlists = await response.json();
        plays = playlists.map(play => {
            let a = document.createElement('a')
            a.href = `/api/users/${username}/${play}`
            a.innerHTML = play
            return a
        });

    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}
async function getThumbnails() {
    try {
        let response = await fetch('/api/thumbnails/songs');
        let thumbList = await response.json();
        thumb = thumbList.map(thumbFile => {
            let a = document.createElement('a');
            a.href = `/Thumbnail/Songs/${thumbFile}`;
            a.innerText = thumbFile;
            return a;
        });
    } catch (error) {
        console.error('Error fetching thumbnails:', error);
    }
}
// Function to get songs from server
async function getsongs(playlist = "/api/users/guest/songs") {
    try {
        let response = await fetch(`${playlist}`);
        let songList = await response.json();
        songs = songList.map(song => {
            let a = document.createElement('a');
            a.href = `/Songs/songs/${song}`;
            a.innerText = song;
            return a;
        });
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

// Function to get the cover images from server

async function getPlayThumbnails() {
    try {
        let response = await fetch('/api/thumbnails/playlist');
        let thumbList = await response.json();
        pthumb = thumbList.map(thumbFile => {
            let a = document.createElement('a');
            a.href = `/Thumbnail/Playlists/${thumbFile}`;
            a.innerText = thumbFile;
            return a;
        });
    } catch (error) {
        console.error('Error fetching thumbnails:', error);
    }
}
async function mapthumb(songname) {
    await getThumbnails()
    for (i = 0; i < thumb.length; i++) {
        if (thumb[i].innerText.replace('.jpeg', '') === songname.replace('.mp3', '')) {
            return thumb[i].href;
        }
    }
    return '';
}
// Function to play the song
async function playsong(songName) {
    let play = document.getElementById('play');
    let songLink = songs.find(element => element.innerText.trim() === songName.trim());

    if (songLink) {
        play.src = "pause-stroke-rounded1.svg";
        currentsong.src = songLink.href;
        currentsong.play();
        document.querySelector(".songname").innerHTML = songName.replace('.mp3', '');
        let image = await mapthumb(songName)
        document.querySelector('.songinfo').querySelector('img').src = image
    }
}

function createList({ imgSrc, title, description }) {
    const list = document.createElement('div')
    list.className = "list";
    list.innerHTML = `
        <img
            src=${imgSrc}>
            <ul>
                <li class="song">${title}</li>
                <li class="artist">${description}</li>
            </ul>
            <div class="playbut1">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
                    class="play">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg>
            </div>`
    return list
}
function createCard({ imgSrc, title, description }) {
    // Create a new div element for the card
    const card = document.createElement('div');
    card.className = 'card';

    // Create the HTML content for the card
    card.innerHTML = `
        <img src=${imgSrc} alt="${title}">
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="playbut">
            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="play">
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
            </svg>
        </div>
        <div class="mod">
        <a href="/modify" id="mod"><button class="plusb">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="12" r="2" fill="white"/>
        <circle cx="12" cy="12" r="2" fill="white"/>
        <circle cx="20" cy="12" r="2" fill="white"/>
        </svg></button></a>
        </div>

    `;

    return card;
}

function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

async function mapplay(playlistname, author) {
    let result = "";
    async function findPlaylistLink() {
        for (let index = 0; index < plays.length; index++) {
            const element = plays[index];
            if (element.innerText === playlistname) {
                return await element.href;
            }
        }
        return "";
    }
    if (author === "Spotify") {
        username = "guest"
        await getPlaylist()
        result = findPlaylistLink()
        username = document.getElementById('profile-name').innerText
    }
    else {
        username = document.getElementById('profile-name').innerText
        await getPlaylist();
        result = findPlaylistLink();
    }
    return result;
}
async function main() {
    await getsongs();
    await getPlaylist();
    await getPlayThumbnails();
    let play = document.getElementById('play');
    currentsong.src = songs[0]?.href || '';
    for (let index = 0; index < plays.length; index++) {
        await getPlaylist();
        const List = { imgSrc: pthumb[Math.floor(Math.random() * 8)].href || "https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb6a22f55c82204edf02dfe58b/2/en/default", title: plays[index].innerText, description: username == "guest" ? "Spotify" : username }
        const lists = createList(List)
        let Playlist = document.querySelector('.playlist ul')
        Playlist.appendChild(lists)
    }
    if (username != "guest") {
        username = "guest"
        await getPlaylist()
        for (let index = 0; index < plays.length; index++) {
            const List = { imgSrc: pthumb[Math.floor(Math.random() * 8)].href || "https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb6a22f55c82204edf02dfe58b/2/en/default", title: plays[index].innerText, description: username == "guest" ? "Spotify" : username }
            const lists = createList(List)
            let list = document.querySelector('.playlist')
            list.appendChild(lists)
        }
        username = document.getElementById('profile-name').innerText || 'guest'
        console.log(username)
    }

    for (let index = 0; index < plays.length; index++) {
        await getPlaylist();
        const Card = { imgSrc: pthumb[Math.floor(Math.random() * 8)].href || "https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb6a22f55c82204edf02dfe58b/2/en/default", title: plays[index].innerText, description: username == "guest" ? "Spotify" : username }
        const card = createCard(Card)
        let cont = document.querySelector('.contt')
        cont.appendChild(card)
    }
    if (username != "guest") {
        username = "guest"
        await getPlaylist()
        for (let index = 0; index < plays.length; index++) {
            const Card = { imgSrc: pthumb[Math.floor(Math.random() * 8)].href || "https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb6a22f55c82204edf02dfe58b/2/en/default", title: plays[index].innerText, description: username == "guest" ? "Spotify" : username }
            const card = createCard(Card)
            let cont = document.querySelector('.contt')
            cont.appendChild(card)
        }
        username = document.getElementById('profile-name').innerText || 'guest'
        console.log(username)
    }
    document.querySelector(".songstart").innerHTML = "-:--";
    document.querySelector(".songend").innerHTML = "-:--";

    Array.from(document.querySelector('.playlist').getElementsByClassName('list')).forEach(e => {
        e.addEventListener('click', async element => {
            playlist_name = await mapplay(e.querySelector('.song').innerText, e.querySelector('.artist').innerText)
            await getsongs(playlist_name)
            console.log(songs)
            playsong(songs[0].innerText)
        });
    });

    Array.from(document.querySelector('.cardContainer').getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async element => {
            playlist_name = await mapplay(e.querySelector('h3').innerHTML, e.querySelector('p').innerHTML)
            await getsongs(playlist_name)
            console.log(songs)
            playsong(songs[0].innerText)
        });
    });

    play.addEventListener('click', () => {
        if (currentsong.paused && currentsong.src !== "") {
            for (const currentindex of songs) {
                if (currentsong.src === currentindex.href) {
                    playsong(currentindex.innerText);
                    break;
                }
            }
        } else {
            currentsong.pause();
            play.src = "play-circle-02-stroke-rounded.svg";
        }
    });

    let next = document.getElementById('next');
    next.addEventListener('click', () => {
        let i = 1;
        for (const currentindex of songs) {
            if (i === songs.length) {
                playsong(songs[0]?.innerText || '');
                break;
            }
            if (currentsong.src === currentindex.href) {
                playsong(songs[i]?.innerText || '');
                break;
            }
            i += 1;
        }
    });

    let prev = document.getElementById('prev');
    prev.addEventListener('click', () => {
        for (let index = (songs.length - 1); index > 0; index--) {
            if (currentsong.src === songs[index]?.href) {
                playsong(songs[index - 1]?.innerText || '');
                break;
            }
        }
    });

    currentsong.addEventListener('timeupdate', () => {
        document.querySelector(".songend").innerHTML = `${convertSecondsToMinutes(currentsong.duration)}`;
        document.querySelector(".songstart").innerHTML = `${convertSecondsToMinutes(currentsong.currentTime)}`;
        let circle = document.getElementById("circle");
        circle.style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        if (currentsong.ended && currentsong.src !== "") {
            let i = 1;
            for (const currentindex of songs) {
                if (i === songs.length) {
                    playsong(songs[1]?.innerText || '');
                    break;
                }
                if (currentsong.src === currentindex.href) {
                    playsong(songs[i]?.innerText || '');
                    break;
                }
                i += 1;
            }
        }
    });

    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let time = e.offsetX / e.target.getBoundingClientRect().width;
        document.getElementById('circle').style.left = time * 100 + "%";
        currentsong.currentTime = currentsong.duration * time;
    });

    document.querySelector('.volume').addEventListener('click', (e) => {
        let vol = document.getElementById('speaker');
        let left = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector('#volume').style.left = left + "%";
        if (left >= 70 && left <= 100) {
            vol.src = "volume.svg";
        }
        if (left < 70 && left > 30) {
            vol.src = "speaker.svg";
        }
        if (left <= 30 && left > 0) {
            vol.src = "low.svg";
        }
        if (left === 0) {
            vol.src = "mute.svg";
        }
        currentsong.volume = left / 100;
    });

    document.querySelector('#speaker').addEventListener('click', () => {
        let vol = document.getElementById('speaker');
        if (currentsong.volume > 0) {
            currentsong.volume = 0;
            vol.src = "mute.svg";
            document.querySelector('#volume').style.left = "0%";
        } else {
            currentsong.volume = 1;
            vol.src = "volume.svg";
            document.querySelector('#volume').style.left = "100%";
        }
    });

    document.querySelector('.menu').addEventListener('click', () => {
        document.querySelector('.left').style.left = 0;
    });

    document.querySelector('.collapse').addEventListener('click', () => {
        document.querySelector('.left').style.left = "-125%";
    });
    document.getElementById('login').addEventListener('click', () => {
        document.querySelector('#profile').classList.remove('show')
    })
    document.getElementById('profile').addEventListener('click', () => {
        document.querySelector('.user-info').classList.toggle('show')
    })

    // Array.from(document.querySelector('.contt').getElementsByClassName('card')).forEach(e => {
    //     const dots = e.querySelector('#mod')
    //     dots.addEventListener('click', async element => {
    //         await fetch('/modify', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ Playlist: e.querySelector('h3').innerHTML })
    //         }).then(response => {
    //             return response.json()
    //         })
    //             .then(data => {
    //                 console.log('Success:', data);
    //             })
    //             .catch(err => {
    //                 console.error("Error:")
    //             })
    //     });
    // });

    Array.from(document.querySelector('.cardContainer').getElementsByClassName('card')).forEach(e => {
        e.querySelector('#mod').addEventListener('click', async event => {
            event.preventDefault();

            const playlistName = e.querySelector('h3').innerHTML

            // Convert data to query string format
            const queryString = new URLSearchParams({
                playlist: playlistName,
            })

            // Redirect to the URL with the query string
            window.location.href = `/modify?${queryString}`;
        });
    });
    let resl = []
    let songl = []
    document.getElementById('searchname').addEventListener('input', async (e) => {
        const searchname = document.getElementById('searchname').value
        const results = document.querySelector('.results')
        if (resl[0] != undefined) {
            for (let index = 0; index < resl.length; index++) {
                console.log(resl[index])
                results.removeChild(resl[index])
            }
            resl=[]
        }
        if (songl[0] != undefined) {
            for (let index = 0; index < songl.length; index++) {
                results.removeChild(songl[index])
            }
            songl = []
        }
        if (searchname == "") {

        }
        else {
            let songval = []
            await getsongs()
            for (let index = 0; index < songs.length; index++) {
                let element = songs[index].innerText.replace('.mp3', '')
                let lowelement = element.toLowerCase()
                if (lowelement.includes(searchname.toLowerCase())) {
                    songval.push(element)
                }
            }
            if (songval[0] == undefined) {
                try {
                    results.querySelector('.resss').innerHTML
                }
                catch (err) {
                    const card = document.createElement('div');
                    card.className = 'resss';
                    card.innerHTML = `<h1>No Matchess</h1>`;
                    results.appendChild(card)
                    resl.push(card)
                }
            }
            else {
                songval.forEach(async song => {
                    const List = { imgSrc: await mapthumb(song), title: song.replace('.mp3', ''), description: '' }
                    const card = createList(List)
                    results.appendChild(card)
                    card.addEventListener('click',()=>{
                        let songname = card.querySelector('.song').innerText+'.mp3'
                        playsong(songname)
                    })
                    songl.push(card)
                });
            }
        }
    });
}

// Call the main function to execute
document.addEventListener('DOMContentLoaded', main())

