import component = require('./component');
import endpoint = require('./endpoint');
import { SmartAPISpec, ParsedAPIMetadataObject, SmartAPIKGOperationObject } from './common/types';

export = class API {
  smartapiDoc: SmartAPISpec;
  metadata: ParsedAPIMetadataObject;
  /**
   * constructor to load SmartAPI specification.
   * @param {object} smartapiDoc - SmartAPI Specification in Javascript Object format
   */
  constructor(smartapiDoc: SmartAPISpec) {
    this.smartapiDoc = smartapiDoc;
    this.metadata = this.fetchAPIMeta();
    this.metadata.operations = this.fetchAllOpts();
  }

  /**
   * Fetch the title of API from SmartAPI Specification.
   */
  private fetchAPITitle(): string | undefined {
    if (!('info' in this.smartapiDoc)) {
      return undefined;
    }
    return this.smartapiDoc.info.title;
  }

  private fetchXTranslatorComponent(): string | undefined {
    if (!('info' in this.smartapiDoc)) {
      return undefined;
    }
    if (!('x-translator' in this.smartapiDoc.info)) {
      return undefined;
    }
    return this.smartapiDoc.info['x-translator'].component;
  }

  private fetchXTranslatorTeam(): string[] {
    if (!('info' in this.smartapiDoc)) {
      return [];
    }
    if (!('x-translator' in this.smartapiDoc.info)) {
      return [];
    }
    return this.smartapiDoc.info['x-translator'].team;
  }

  /**
   * Fetch the tags associated with the API from SmartAPI Specification.
   */
  private fetchAPITags(): string[] {
    if (!('tags' in this.smartapiDoc)) {
      return undefined;
    }
    return this.smartapiDoc.tags.map((x) => x.name);
  }

  /**
   * Fetch the url of the server from SmartAPI Specification.
   */
  private fetchServerUrl(): string | undefined {
    if (!('servers' in this.smartapiDoc)) {
      return undefined;
    }
    return this.smartapiDoc.servers[0].url;
  }

  /**
   * Fetch component from SmartAPI Specification.
   */
  private fetchComponents() {
    if (!('components' in this.smartapiDoc)) {
      return undefined;
    }
    return new component(this.smartapiDoc.components);
  }

  /**
   * Fetch metadata information from SmartAPI Specification.
   */
  fetchAPIMeta(): ParsedAPIMetadataObject {
    return {
      title: this.fetchAPITitle(),
      tags: this.fetchAPITags(),
      url: this.fetchServerUrl(),
      'x-translator': {
        component: this.fetchXTranslatorComponent(),
        team: this.fetchXTranslatorTeam(),
      },
      smartapi: {
        id: this.smartapiDoc._id,
        meta: this.smartapiDoc._meta,
      },
      components: this.fetchComponents(),
      paths: this.smartapiDoc.paths instanceof Object ? Object.keys(this.smartapiDoc.paths) : [],
      operations: [],
    };
  }

  /**
   * Fetch all operations from SmartAPI Specification.
   */
  private fetchAllOpts(): SmartAPIKGOperationObject[] {
    let ops = [] as SmartAPIKGOperationObject[];
    const apiMeta = this.fetchAPIMeta();
    if ('paths' in this.smartapiDoc) {
      for (const path of Object.keys(this.smartapiDoc.paths)) {
        const ep = new endpoint(this.smartapiDoc.paths[path], apiMeta, path);
        ops = [...ops, ...ep.constructEndpointInfo()];
      }
    }
    return ops;
  }
};
