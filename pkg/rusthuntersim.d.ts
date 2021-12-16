declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	/**
	* @param {string} spell_type
	* @returns {Int32Array}
	*/
	export function get_spells(spell_type: string): Int32Array;
	/**
	* @param {string} settings_json
	* @returns {Stats}
	*/
	export function get_stats(settings_json: string): Stats;
	/**
	* @param {string} settings_json
	* @returns {Summary}
	*/
	export function run_sim(settings_json: string): Summary;
	/**
	*/
	export class Stats {
	  free(): void;
	/**
	*/
	  agi: number;
	/**
	*/
	  crit: number;
	/**
	*/
	  haste: number;
	/**
	*/
	  hit: number;
	/**
	*/
	  ranged_ap: number;
	}
	/**
	*/
	export class Summary {
	  free(): void;
	/**
	*/
	  arcane_shot_casts: number;
	/**
	*/
	  arcane_shot_crits: number;
	/**
	*/
	  arcane_shot_dps: number;
	/**
	*/
	  auto_shot_casts: number;
	/**
	*/
	  auto_shot_crits: number;
	/**
	*/
	  auto_shot_dps: number;
	/**
	*/
	  dps: number;
	/**
	*/
	  multi_shot_casts: number;
	/**
	*/
	  multi_shot_crits: number;
	/**
	*/
	  multi_shot_dps: number;
	/**
	*/
	  pet_dps: number;
	/**
	*/
	  steady_shot_casts: number;
	/**
	*/
	  steady_shot_crits: number;
	/**
	*/
	  steady_shot_dps: number;
	}
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly get_spells: (a: number, b: number, c: number) => void;
  readonly __wbg_stats_free: (a: number) => void;
  readonly __wbg_get_stats_ranged_ap: (a: number) => number;
  readonly __wbg_set_stats_ranged_ap: (a: number, b: number) => void;
  readonly __wbg_get_stats_agi: (a: number) => number;
  readonly __wbg_set_stats_agi: (a: number, b: number) => void;
  readonly __wbg_get_stats_crit: (a: number) => number;
  readonly __wbg_set_stats_crit: (a: number, b: number) => void;
  readonly __wbg_get_stats_hit: (a: number) => number;
  readonly __wbg_set_stats_hit: (a: number, b: number) => void;
  readonly __wbg_get_stats_haste: (a: number) => number;
  readonly __wbg_set_stats_haste: (a: number, b: number) => void;
  readonly get_stats: (a: number, b: number) => number;
  readonly run_sim: (a: number, b: number) => number;
  readonly __wbg_summary_free: (a: number) => void;
  readonly __wbg_get_summary_dps: (a: number) => number;
  readonly __wbg_set_summary_dps: (a: number, b: number) => void;
  readonly __wbg_get_summary_pet_dps: (a: number) => number;
  readonly __wbg_set_summary_pet_dps: (a: number, b: number) => void;
  readonly __wbg_get_summary_auto_shot_casts: (a: number) => number;
  readonly __wbg_set_summary_auto_shot_casts: (a: number, b: number) => void;
  readonly __wbg_get_summary_auto_shot_crits: (a: number) => number;
  readonly __wbg_set_summary_auto_shot_crits: (a: number, b: number) => void;
  readonly __wbg_get_summary_auto_shot_dps: (a: number) => number;
  readonly __wbg_set_summary_auto_shot_dps: (a: number, b: number) => void;
  readonly __wbg_get_summary_steady_shot_casts: (a: number) => number;
  readonly __wbg_set_summary_steady_shot_casts: (a: number, b: number) => void;
  readonly __wbg_get_summary_steady_shot_crits: (a: number) => number;
  readonly __wbg_set_summary_steady_shot_crits: (a: number, b: number) => void;
  readonly __wbg_get_summary_steady_shot_dps: (a: number) => number;
  readonly __wbg_set_summary_steady_shot_dps: (a: number, b: number) => void;
  readonly __wbg_get_summary_multi_shot_casts: (a: number) => number;
  readonly __wbg_set_summary_multi_shot_casts: (a: number, b: number) => void;
  readonly __wbg_get_summary_multi_shot_crits: (a: number) => number;
  readonly __wbg_set_summary_multi_shot_crits: (a: number, b: number) => void;
  readonly __wbg_get_summary_multi_shot_dps: (a: number) => number;
  readonly __wbg_set_summary_multi_shot_dps: (a: number, b: number) => void;
  readonly __wbg_get_summary_arcane_shot_casts: (a: number) => number;
  readonly __wbg_set_summary_arcane_shot_casts: (a: number, b: number) => void;
  readonly __wbg_get_summary_arcane_shot_crits: (a: number) => number;
  readonly __wbg_set_summary_arcane_shot_crits: (a: number, b: number) => void;
  readonly __wbg_get_summary_arcane_shot_dps: (a: number) => number;
  readonly __wbg_set_summary_arcane_shot_dps: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
declare function wasm_bindgen (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
