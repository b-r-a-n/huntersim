let wasm_bindgen;
(function() {
    const __exports = {};
    let wasm;

    let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder.decode();

    let cachegetUint8Memory0 = null;
    function getUint8Memory0() {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }

    let WASM_VECTOR_LEN = 0;

    let cachedTextEncoder = new TextEncoder('utf-8');

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length);
            getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3);
            const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    let cachegetInt32Memory0 = null;
    function getInt32Memory0() {
        if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
            cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
        }
        return cachegetInt32Memory0;
    }

    function getArrayI32FromWasm0(ptr, len) {
        return getInt32Memory0().subarray(ptr / 4, ptr / 4 + len);
    }
    /**
    * @param {string} spell_type
    * @returns {Int32Array}
    */
    __exports.get_spells = function(spell_type) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(spell_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.get_spells(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayI32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    };

    /**
    * @param {string} settings_json
    * @returns {Stats}
    */
    __exports.get_stats = function(settings_json) {
        var ptr0 = passStringToWasm0(settings_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.get_stats(ptr0, len0);
        return Stats.__wrap(ret);
    };

    /**
    * @param {string} settings_json
    * @returns {Summary}
    */
    __exports.run_sim = function(settings_json) {
        var ptr0 = passStringToWasm0(settings_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.run_sim(ptr0, len0);
        return Summary.__wrap(ret);
    };

    /**
    */
    class Stats {

        static __wrap(ptr) {
            const obj = Object.create(Stats.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_stats_free(ptr);
        }
        /**
        */
        get ranged_ap() {
            var ret = wasm.__wbg_get_stats_ranged_ap(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set ranged_ap(arg0) {
            wasm.__wbg_set_stats_ranged_ap(this.ptr, arg0);
        }
        /**
        */
        get agi() {
            var ret = wasm.__wbg_get_stats_agi(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set agi(arg0) {
            wasm.__wbg_set_stats_agi(this.ptr, arg0);
        }
        /**
        */
        get crit() {
            var ret = wasm.__wbg_get_stats_crit(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set crit(arg0) {
            wasm.__wbg_set_stats_crit(this.ptr, arg0);
        }
        /**
        */
        get hit() {
            var ret = wasm.__wbg_get_stats_hit(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set hit(arg0) {
            wasm.__wbg_set_stats_hit(this.ptr, arg0);
        }
        /**
        */
        get haste() {
            var ret = wasm.__wbg_get_stats_haste(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set haste(arg0) {
            wasm.__wbg_set_stats_haste(this.ptr, arg0);
        }
    }
    __exports.Stats = Stats;
    /**
    */
    class Summary {

        static __wrap(ptr) {
            const obj = Object.create(Summary.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_summary_free(ptr);
        }
        /**
        */
        get dps() {
            var ret = wasm.__wbg_get_summary_dps(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set dps(arg0) {
            wasm.__wbg_set_summary_dps(this.ptr, arg0);
        }
        /**
        */
        get pet_dps() {
            var ret = wasm.__wbg_get_summary_pet_dps(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set pet_dps(arg0) {
            wasm.__wbg_set_summary_pet_dps(this.ptr, arg0);
        }
        /**
        */
        get auto_shot_casts() {
            var ret = wasm.__wbg_get_summary_auto_shot_casts(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set auto_shot_casts(arg0) {
            wasm.__wbg_set_summary_auto_shot_casts(this.ptr, arg0);
        }
        /**
        */
        get auto_shot_crits() {
            var ret = wasm.__wbg_get_summary_auto_shot_crits(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set auto_shot_crits(arg0) {
            wasm.__wbg_set_summary_auto_shot_crits(this.ptr, arg0);
        }
        /**
        */
        get auto_shot_dps() {
            var ret = wasm.__wbg_get_summary_auto_shot_dps(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set auto_shot_dps(arg0) {
            wasm.__wbg_set_summary_auto_shot_dps(this.ptr, arg0);
        }
        /**
        */
        get steady_shot_casts() {
            var ret = wasm.__wbg_get_summary_steady_shot_casts(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set steady_shot_casts(arg0) {
            wasm.__wbg_set_summary_steady_shot_casts(this.ptr, arg0);
        }
        /**
        */
        get steady_shot_crits() {
            var ret = wasm.__wbg_get_summary_steady_shot_crits(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set steady_shot_crits(arg0) {
            wasm.__wbg_set_summary_steady_shot_crits(this.ptr, arg0);
        }
        /**
        */
        get steady_shot_dps() {
            var ret = wasm.__wbg_get_summary_steady_shot_dps(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set steady_shot_dps(arg0) {
            wasm.__wbg_set_summary_steady_shot_dps(this.ptr, arg0);
        }
        /**
        */
        get multi_shot_casts() {
            var ret = wasm.__wbg_get_summary_multi_shot_casts(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set multi_shot_casts(arg0) {
            wasm.__wbg_set_summary_multi_shot_casts(this.ptr, arg0);
        }
        /**
        */
        get multi_shot_crits() {
            var ret = wasm.__wbg_get_summary_multi_shot_crits(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set multi_shot_crits(arg0) {
            wasm.__wbg_set_summary_multi_shot_crits(this.ptr, arg0);
        }
        /**
        */
        get multi_shot_dps() {
            var ret = wasm.__wbg_get_summary_multi_shot_dps(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set multi_shot_dps(arg0) {
            wasm.__wbg_set_summary_multi_shot_dps(this.ptr, arg0);
        }
        /**
        */
        get arcane_shot_casts() {
            var ret = wasm.__wbg_get_summary_arcane_shot_casts(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set arcane_shot_casts(arg0) {
            wasm.__wbg_set_summary_arcane_shot_casts(this.ptr, arg0);
        }
        /**
        */
        get arcane_shot_crits() {
            var ret = wasm.__wbg_get_summary_arcane_shot_crits(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set arcane_shot_crits(arg0) {
            wasm.__wbg_set_summary_arcane_shot_crits(this.ptr, arg0);
        }
        /**
        */
        get arcane_shot_dps() {
            var ret = wasm.__wbg_get_summary_arcane_shot_dps(this.ptr);
            return ret;
        }
        /**
        * @param {number} arg0
        */
        set arcane_shot_dps(arg0) {
            wasm.__wbg_set_summary_arcane_shot_dps(this.ptr, arg0);
        }
    }
    __exports.Summary = Summary;

    async function load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    async function init(input) {
        if (typeof input === 'undefined') {
            let src;
            if (typeof document === 'undefined') {
                src = location.href;
            } else {
                src = document.currentScript.src;
            }
            input = src.replace(/\.js$/, '_bg.wasm');
        }
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }



        const { instance, module } = await load(await input, imports);

        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    }

    wasm_bindgen = Object.assign(init, __exports);

})();
