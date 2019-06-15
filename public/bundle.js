
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy(component, detaching) {
        if (component.$$) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                $$.fragment.l(children(options.target));
            }
            else {
                $$.fragment.c();
            }
            if (options.intro && component.$$.fragment.i)
                component.$$.fragment.i();
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy(this, true);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    //export const photos = writable([]);

    const config = {
        'API_KEY': 'AIzaSyCAr4_7aSMmQ4kLnR5cbqnCYbLdPPtw2Hw',
        'CLIENT_ID': '273033434753-laf0qm75cehad2f7p7uuv8ppnvq6753a.apps.googleusercontent.com',
    };

    /* src\PhotoBackground.svelte generated by Svelte v3.4.4 */

    const file = "src\\PhotoBackground.svelte";

    // (159:0) {:else}
    function create_else_block(ctx) {
    	var h1, t_1, button, dispose;

    	return {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "You are not authenticated.";
    			t_1 = space();
    			button = element("button");
    			button.textContent = "authorize and load";
    			add_location(h1, file, 159, 1, 5365);
    			add_location(button, file, 160, 1, 5402);
    			dispose = listen(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t_1, anchor);
    			insert(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h1);
    				detach(t_1);
    				detach(button);
    			}

    			dispose();
    		}
    	};
    }

    // (157:0) {#if googlePhotosClientLoaded}
    function create_if_block(ctx) {
    	return {
    		c: noop,
    		m: noop,
    		d: noop
    	};
    }

    function create_fragment(ctx) {
    	var div, dispose;

    	function select_block_type(ctx) {
    		if (ctx.googlePhotosClientLoaded) return create_if_block;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block = current_block_type(ctx);

    	return {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			div.className = "content svelte-1p2f574";
    			add_location(div, file, 155, 0, 5094);

    			dispose = [
    				listen(div, "click", ctx.click_handler_1),
    				listen(div, "dblclick", ctx.dblclick_handler),
    				listen(div, "taphold", ctx.taphold_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			if_block.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if_block.d();
    			run_all(dispose);
    		}
    	};
    }

    const SLIDESHOW_INTERVAL = 30;

    const GETNEWPHOTOS_INTERVAL = 60;

    function authenticate() {
    	const authInstance = gapi.auth2.getAuthInstance();

    	if (authInstance.isSignedIn.get()) {
    		console.log("User already signed in.");
    	} else {
    		//authInstance.signIn({scope: "https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata"})
    		authInstance.signIn({scope: "https://www.googleapis.com/auth/photoslibrary.readonly"})
    		.then(function() { console.log("Sign-in successful"); },
    			function(err) { console.error("Error signing in", err); });
    	}
    	return authInstance;
    }

    function changeBackgroundImage(imgUrl) {
    	const img = new Image();

    	img.onload = function() {
    		document.querySelector('html').style.backgroundImage = `url(${img.src})`;
    	};

    	img.src = imgUrl;
    }

    function instance($$self, $$props, $$invalidate) {
    	

    	let { db } = $$props;
    	console.log({db});

    	let googlePhotosClientLoaded = false;
    	function loadClient() {
    		gapi.client.setApiKey(config.API_KEY);
    		return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
    			.then(function() { 
    				$$invalidate('googlePhotosClientLoaded', googlePhotosClientLoaded = true); 
    				console.log("GAPI client loaded for API"); 
    				
    	 			schedule_displayRandomPhoto(0);
    				schedule_getPictures(0);
    			},
    				function(err) { console.error("Error loading GAPI client for API", err); });
    	}

    	const timeouts = {};
    	const timeoutHandler = (desiredItem, desiredCommand, desiredCommandParameter) => {
    		//console.log('timeoutHandler:', {desiredItem, desiredCommand, desiredCommandParameter});
    		const commands = {
    			'schedule': () => {
    				clearInterval(timeouts[desiredItem]);
    				timeouts[desiredItem] = setTimeout(desiredCommandParameter.function, desiredCommandParameter.timeout);			},
    		};
    		
    		// create new timeout item if necessary
    		if (Object.keys(timeouts).includes(desiredItem) === false) { timeouts[desiredItem] = false; }

    		// run command
    		commands[desiredCommand]();
    	};

    	const scheduleFunction = (functionName, functionObj, scheduleSeconds) => {
    		console.log('scheduleFunction:', {functionName, scheduleSeconds});
    		timeoutHandler(functionName, 'schedule', {
    			'function': functionObj,
    			'timeout': scheduleSeconds * 1000,
    		});
    	};

    	const schedule_displayRandomPhoto = (scheduleSeconds = SLIDESHOW_INTERVAL) => scheduleFunction('displayRandomPhoto', displayRandomPhoto, scheduleSeconds);
    	async function displayRandomPhoto() {
    		const totalNoOfPhotos = await db.photos.count();
    		const randomPhotoIndex = Math.round(Math.random() * totalNoOfPhotos);
    		const randomPhotoItem = await db.photos.offset(randomPhotoIndex).limit(1).first();
    		const randomPhotoId = randomPhotoItem.id;
    		console.log('displayRandomPhoto:', {totalNoOfPhotos, randomPhotoIndex, randomPhotoItem, randomPhotoId});

    		return gapi.client.photoslibrary.mediaItems.get({
          		"mediaItemId": randomPhotoId,
        	})
            .then(
    			function(response) {
    				// Handle the results here (response.result has the parsed body).
    				console.log("Recevied photo data from Google:", response);
    				changeBackgroundImage(`${response.result.baseUrl}=w0-h0`);
    				schedule_displayRandomPhoto();
    			},
    			function(err) {
    				console.error("Execute error", err); 
    				schedule_displayRandomPhoto(0);
    			}
    		);
    	 }


    	let pageToken = '';
    	const schedule_getPictures = (scheduleSeconds = GETNEWPHOTOS_INTERVAL) => scheduleFunction('getPictures', getPictures, scheduleSeconds);
    	// Make sure the client is loaded and sign-in is complete before calling this method.
    	function getPictures() {
    		return gapi.client.photoslibrary.mediaItems.search({
    			"resource": {
    				"pageSize": 100,
    				pageToken
    			},
    		}).then(async function(response) {
    			// Handle the results here (response.result has the parsed body).
    			console.log("getPictures: ", response);
    			const { result } = response;

    			const newPhotoIds = result.mediaItems.filter(item => {
    				const validPhotoTest = [
    					item.mimeType.includes('image/'),
    					(item.filename.toLowerCase().includes("screenshot") === false),
    					// check if metadata exists (disabled for now)
    					// (Object.keys(item.mediaMetadata.photo).length > 0),
    				];

    				return validPhotoTest.every(item => item === true);
    			}).map(item => item.id);

    			const nowTime = Math.round((new Date).getTime() / 1000);
    			await db.photos.bulkPut(newPhotoIds.map(item => { 
    				return {'id': item, 'modified': nowTime};
    			})).catch((err) => {
    				console.error("Dexie error", err); 
    			});
    			pageToken = result.nextPageToken;
    			schedule_getPictures();
    		}, function(err) { 
    			console.error("Execute error", err); 
    			schedule_getPictures();
    		});
    	}

    	gapi.load("client:auth2", function() {
    		gapi.auth2.init({client_id: config.CLIENT_ID}).then( () => {
    			const authInstance = gapi.auth2.getAuthInstance();
    			if (authInstance.isSignedIn.get()) loadClient();
    		});
    	});

    	const writable_props = ['db'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PhotoBackground> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		return authenticate().then(loadClient);
    	}

    	function click_handler_1() {
    		return schedule_displayRandomPhoto(0);
    	}

    	function dblclick_handler() {
    		return document.body.requestFullscreen();
    	}

    	function taphold_handler() {
    		return document.body.requestFullscreen();
    	}

    	$$self.$set = $$props => {
    		if ('db' in $$props) $$invalidate('db', db = $$props.db);
    	};

    	return {
    		db,
    		googlePhotosClientLoaded,
    		loadClient,
    		schedule_displayRandomPhoto,
    		document,
    		click_handler,
    		click_handler_1,
    		dblclick_handler,
    		taphold_handler
    	};
    }

    class PhotoBackground extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["db"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.db === undefined && !('db' in props)) {
    			console.warn("<PhotoBackground> was created without expected prop 'db'");
    		}
    	}

    	get db() {
    		throw new Error("<PhotoBackground>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set db(value) {
    		throw new Error("<PhotoBackground>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Clock.svelte generated by Svelte v3.4.4 */

    const file$1 = "src\\Clock.svelte";

    function create_fragment$1(ctx) {
    	var div, t;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.timeString);
    			div.className = "svelte-5q5vyy";
    			add_location(div, file$1, 13, 0, 197);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.timeString) {
    				set_data(t, ctx.timeString);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { timeString = "0:00" } = $$props;

    	const writable_props = ['timeString'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Clock> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('timeString' in $$props) $$invalidate('timeString', timeString = $$props.timeString);
    	};

    	return { timeString };
    }

    class Clock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["timeString"]);
    	}

    	get timeString() {
    		throw new Error("<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeString(value) {
    		throw new Error("<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\PhotoSlogan.svelte generated by Svelte v3.4.4 */

    const file$2 = "src\\PhotoSlogan.svelte";

    function create_fragment$2(ctx) {
    	var div, t;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.photoSlogan);
    			div.className = "svelte-1so9xd0";
    			add_location(div, file$2, 14, 0, 219);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.photoSlogan) {
    				set_data(t, ctx.photoSlogan);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { photoSlogan = "" } = $$props;

    	const writable_props = ['photoSlogan'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PhotoSlogan> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('photoSlogan' in $$props) $$invalidate('photoSlogan', photoSlogan = $$props.photoSlogan);
    	};

    	return { photoSlogan };
    }

    class PhotoSlogan extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["photoSlogan"]);
    	}

    	get photoSlogan() {
    		throw new Error("<PhotoSlogan>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set photoSlogan(value) {
    		throw new Error("<PhotoSlogan>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\BottomBar.svelte generated by Svelte v3.4.4 */

    const file$3 = "src\\BottomBar.svelte";

    function create_fragment$3(ctx) {
    	var div, t, current;

    	var clock = new Clock({
    		props: { timeString: ctx.timeString },
    		$$inline: true
    	});

    	var photoslogan = new PhotoSlogan({
    		props: { photoSlogan: ctx.dateString },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			clock.$$.fragment.c();
    			t = space();
    			photoslogan.$$.fragment.c();
    			div.className = "svelte-m3u4ae";
    			add_location(div, file$3, 57, 0, 1572);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(clock, div, null);
    			append(div, t);
    			mount_component(photoslogan, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var clock_changes = {};
    			if (changed.timeString) clock_changes.timeString = ctx.timeString;
    			clock.$set(clock_changes);

    			var photoslogan_changes = {};
    			if (changed.dateString) photoslogan_changes.photoSlogan = ctx.dateString;
    			photoslogan.$set(photoslogan_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			clock.$$.fragment.i(local);

    			photoslogan.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			clock.$$.fragment.o(local);
    			photoslogan.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			clock.$destroy();

    			photoslogan.$destroy();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	
    	let time = new Date();

    	onMount(() => {
    		const interval = setInterval(() => {
    			$$invalidate('time', time = new Date());
            }, 1000);
        });

        const timeStringFormatter = (timeObj) => {
            let hoursFormatted = timeObj.getHours();
            if (hoursFormatted === 0) hoursFormatted = 12;
            else if (hoursFormatted > 12) hoursFormatted = hoursFormatted - 12;

            let minutesFormatted = timeObj.getMinutes().toString().padStart(2, '0');

            return `${hoursFormatted}:${minutesFormatted}`;
        };

        const dateStringFormatter = (timeObj) => {

            const dateStrings = timeObj.toDateString().split(' ');

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const days_short = days.map( item => item.substr(0,3));

            const day = days[days_short.indexOf(dateStrings[0])];
            const month = dateStrings[1];
            const date =  dateStrings[2];
            return `${day}, ${month} ${date}`;
        };

    	let timeString, dateString;

    	$$self.$$.update = ($$dirty = { time: 1 }) => {
    		if ($$dirty.time) { $$invalidate('timeString', timeString = timeStringFormatter(time)); }
    		if ($$dirty.time) { $$invalidate('dateString', dateString = dateStringFormatter(time)); }
    	};

    	return { timeString, dateString };
    }

    class BottomBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, []);
    	}
    }

    /* src\App.svelte generated by Svelte v3.4.4 */

    function create_fragment$4(ctx) {
    	var t, current;

    	var photobackground = new PhotoBackground({
    		props: { db: ctx.db },
    		$$inline: true
    	});

    	var bottombar = new BottomBar({ $$inline: true });

    	return {
    		c: function create() {
    			photobackground.$$.fragment.c();
    			t = space();
    			bottombar.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(photobackground, target, anchor);
    			insert(target, t, anchor);
    			mount_component(bottombar, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var photobackground_changes = {};
    			if (changed.db) photobackground_changes.db = ctx.db;
    			photobackground.$set(photobackground_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			photobackground.$$.fragment.i(local);

    			bottombar.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			photobackground.$$.fragment.o(local);
    			bottombar.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			photobackground.$destroy(detaching);

    			if (detaching) {
    				detach(t);
    			}

    			bottombar.$destroy(detaching);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	

    	let { name, version } = $$props;

    	console.log(`Starting ${name} v${version}...`);
    	
    	let { db } = $$props;
    	$$invalidate('db', db = new Dexie("fotoDatabase"));
    	db.version(1).stores({
    		photos: 'id'
    	});

    	const writable_props = ['name', 'version', 'db'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('name' in $$props) $$invalidate('name', name = $$props.name);
    		if ('version' in $$props) $$invalidate('version', version = $$props.version);
    		if ('db' in $$props) $$invalidate('db', db = $$props.db);
    	};

    	return { name, version, db };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["name", "version", "db"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.name === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    		if (ctx.version === undefined && !('version' in props)) {
    			console.warn("<App> was created without expected prop 'version'");
    		}
    		if (ctx.db === undefined && !('db' in props)) {
    			console.warn("<App> was created without expected prop 'db'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get version() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get db() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set db(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Foto',
    		version: `0.2`,
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
