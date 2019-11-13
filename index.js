'use strict';

const functions = require('firebase-functions');
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

/**
 * @name triggerToListnerName
 * @description Method used to transform a trigger into a camel case listener name
 * @param {string} trigger The trigger to be transformed (e.g.: 'zendesk-search-success')
 * @returns {string} The listener name (e.g.: 'listenerZendeskSearchSuccess')
 */
const triggerToListnerName = trigger => {
  let parts = trigger.split('-');
  return parts.reduce((start, p) => {
    return `${start}${p.charAt(0).toUpperCase()}${p.slice(1)}`;
  }, 'listener');
};

/**
 * @name registryListener
 * @description Method used to registry listeners functions for given triggers
 * @param {string} trigger
 */
const registryListener = trigger => {
  exports[triggerToListnerName(trigger)] = functions.pubsub
    .topic(trigger)
    .onPublish(async event => {
      try {
        const data = event.json.data;
        const config = event.json.config;
        const next = config.pipeline[data.origin][trigger];
        if (next) await pubsub.topic(next).publishJSON(event.json);
        else Promise.resolve();
      } catch(error) {
        console.error(error);
      }
    });
};

/** setup */
const triggers = [
  'zendesk-search-success',
  'zendesk-get-ticket-comments-success',
  'zendesk-update-ticket-success',
  'zendesk-webhook-success',
  'df-process-text-success',
  'messenger-send-message-success',
  'messenger-extract-messages-success',
  'webui-read-message-success',
  'webui-format-outgoing-message-success',

  /** serasa MPME */
  'serasa-mpme-format-ticket-comment-success',
  'serasa-mpme-format-ticket-tags-success',
  'mpme-handle-df-actions-success',
  'mpme-handle-df-actions-transfer',
  'mpme-handle-df-parameters-success',
  'mpme-handle-df-parameters-followup',
  'webui-incoming-success',
  'webui-outgoing-success',

  /** serasa Email */
  'serasa-email-rules-success',
  'serasa-email-rules-paidnotupdate-success',
  'serasa-get-ticket-success',
  'serasa-get-context-success',

  /** serasa Messenger */
  'serasa-messenger-parameters-success',
  'serasa-messenger-actions-success',
  'zendesk-create-ticket-success',
  'zendesk-create-user-success',
  'bigquery-save-activity-success',

  /** serasa certificado digital */
  'cd-handle-df-actions-success',
  'cd-handle-df-parameters-success',
  'cd-handle-df-actions-chargeback',
  'cd-handle-zendesk-update-success',
  'serasa-cd-wpp-actions-success',
  /** serasa whatsapp */
  'movile-wpp-extract-messages-success',
  'movile-wpp-send-messages-success',
  'movile-wpp-rules-parameters-success',
  'movile-wpp-rules-actions-success',
  'movile-wpp-rules-zendesk-success',

  /**vitreo poc */
  'vitreo-handle-df-actions-success',
  'vitreo-handle-df-parameters-success',

  /** naturgy poc */
  'naturgy-handle-df-actions-success',
  'naturgy-handle-df-parameters-success'
];
triggers.forEach(trigger => registryListener(trigger));