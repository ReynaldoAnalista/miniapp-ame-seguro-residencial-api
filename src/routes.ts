/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthTokenController } from './modules/authToken/controllers/AuthTokenController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './modules/default/controllers/HealthController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { healthCareProposalController } from './modules/healthCareProposal/controllers/healthCareProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HubController } from './modules/hub/controllers/HubController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LifeProposalController } from './modules/lifeProposal/controllers/LifeProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PetProposalController } from './modules/petProposal/controllers/PetProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PortableProposalController } from './modules/portableProposal/controllers/PortableProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MaintenanceResidentialController } from './modules/residentialProposal/controllers/MaintenanceResidentialController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OldResidentialProposalController } from './modules/residentialProposal/controllers/OldResidentialProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ResidentialProposalController } from './modules/residentialProposal/controllers/ResidentialProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ZipCodeController } from './modules/residentialProposal/controllers/ZipCodeController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SmartphoneProposalController } from './modules/smartphoneProposal/controllers/SmartphoneProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UnusualController } from './modules/unusual/controllers/UnusualController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RenewPortableController } from './modules/renewPortableProposal/controllers/RenewPortableController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MaintenanceController } from './modules/maintenance/controllers/MaintenanceController';
import { expressAuthentication } from './middleware/authentication';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import { iocContainer } from './inversify/inversify.config';
import { IocContainer, IocContainerFactory } from '@tsoa/runtime';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "HealthCareProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LifeProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PetProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PortableProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PortableDigibeeConfirmation": {
        "dataType": "refObject",
        "properties": {
            "control_data": {"dataType":"nestedObjectLiteral","nestedProperties":{"rejection_description":{"dataType":"string","required":true},"rejection_reason_code":{"dataType":"double","required":true},"sequential_shipping_number":{"dataType":"double","required":true},"shipping_file_number":{"dataType":"double","required":true},"acceptance_type":{"dataType":"string","required":true},"processing_data":{"dataType":"string","required":true},"customer_identifier_code":{"dataType":"string","required":true},"key_contract_certificate_number":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResidentialProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SmartphoneProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DigibeeConfirmation": {
        "dataType": "refObject",
        "properties": {
            "control_data": {"dataType":"nestedObjectLiteral","nestedProperties":{"rejection_description":{"dataType":"string","required":true},"rejection_reason_code":{"dataType":"double","required":true},"sequential_shipping_number":{"dataType":"double","required":true},"shipping_file_number":{"dataType":"double","required":true},"acceptance_type":{"dataType":"string","required":true},"processing_data":{"dataType":"string","required":true},"customer_identifier_code":{"dataType":"string","required":true},"key_contract_certificate_number":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RenewPortableProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceUpdatePlanNotification": {
        "dataType": "refObject",
        "properties": {
            "signedUpdatePlanStatus": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "updatePlanStatus": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceSoldProposal": {
        "dataType": "refObject",
        "properties": {
            "customerId": {"dataType":"string","required":true},
            "order": {"dataType":"string","required":true},
            "tenant": {"dataType":"string","required":true},
            "receivedPaymentNotification": {"dataType":"any","required":true},
            "partnerResponse": {"dataType":"any","required":true},
            "success": {"dataType":"boolean","required":true},
            "createdAt": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "apiVersion": {"dataType":"string","required":true},
            "NSU": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceNotification": {
        "dataType": "refObject",
        "properties": {
            "signedInfo": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/ame-seguro-residencial/health',

            async function HealthController_health(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HealthController>(HealthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.health.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/health/test',

            async function HealthController_test(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HealthController>(HealthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.test.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/healthcare/sendProposal',

            async function healthCareProposalController_sendProposal(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"ref":"HealthCareProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<healthCareProposalController>(healthCareProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/healthcare/cancelProposal',

            async function healthCareProposalController_cancelProposal(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<healthCareProposalController>(healthCareProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.cancelProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/hub/plans/:customerId',

            async function HubController_retrievePlans(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HubController>(HubController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.retrievePlans.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/hub/rawplans/:customerId',

            async function HubController_retrieveRawPlans(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HubController>(HubController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.retrieveRawPlans.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/hub/plans/:customerId/:orderId/remove',

            async function HubController_removePlan(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HubController>(HubController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.removePlan.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/hub/configs/:key',

            async function HubController_retrieveConfigs(request: any, response: any, next: any) {
            const args = {
                    key: {"in":"path","name":"key","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HubController>(HubController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.retrieveConfigs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/hub/tables/:key',

            async function HubController_checkTables(request: any, response: any, next: any) {
            const args = {
                    key: {"in":"path","name":"key","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HubController>(HubController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.checkTables.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/hub/faq',

            async function HubController_faqInfo(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HubController>(HubController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.faqInfo.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/life/sendProposal',

            async function LifeProposalController_proposal(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"ref":"LifeProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<LifeProposalController>(LifeProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.proposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/life/plan_info',

            async function LifeProposalController_planInfo(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<LifeProposalController>(LifeProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.planInfo.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/life/cotation',

            async function LifeProposalController_cotation(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<LifeProposalController>(LifeProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.cotation.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/life/validate_customer/:customerId',

            async function LifeProposalController_validateCustomer(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<LifeProposalController>(LifeProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.validateCustomer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/pet/planList',

            async function PetProposalController_planList(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PetProposalController>(PetProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.planList.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/pet/petDescPlan/:planId',

            async function PetProposalController_descPetList(request: any, response: any, next: any) {
            const args = {
                    planId: {"in":"path","name":"planId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PetProposalController>(PetProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.descPetList.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/pet/sendProposal',

            async function PetProposalController_sendProposal(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"ref":"PetProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PetProposalController>(PetProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/pet/quote/:idPlan',

            async function PetProposalController_quotationPetPlans(request: any, response: any, next: any) {
            const args = {
                    idPlan: {"in":"path","name":"idPlan","required":true,"dataType":"string"},
                    petQuotationPlan: {"in":"body","name":"petQuotationPlan","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PetProposalController>(PetProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.quotationPetPlans.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/sendProposal',

            async function PortableProposalController_sendProposal(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"ref":"PortableProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/updateProposal/:proposalId',

            async function PortableProposalController_updateProposal(request: any, response: any, next: any) {
            const args = {
                    proposalId: {"in":"path","name":"proposalId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/update_many_proposal',

            async function PortableProposalController_updateManyProposal(request: any, response: any, next: any) {
            const args = {
                    proposal: {"in":"body","name":"proposal","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateManyProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/proposal/:pass/sendEmail',

            async function PortableProposalController_sendMailProposal(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendMailProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/proposal/:pass/sendEmail/:email',

            async function PortableProposalController_sendMailProposalToMe(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
                    email: {"in":"path","name":"email","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendMailProposalToMe.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/sold_proposal/:customerId/:order/statusUpdate',

            async function PortableProposalController_statusUpdateSoldProposal(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
                    order: {"in":"path","name":"order","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.statusUpdateSoldProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/portable/validate_email/:pass',

            async function PortableProposalController_validateMailProposal(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.validateMailProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/confirm_proposal',

            async function PortableProposalController_confirmProposal(request: any, response: any, next: any) {
            const args = {
                    digibeeConfirmation: {"in":"body","name":"digibeeConfirmation","required":true,"ref":"PortableDigibeeConfirmation"},
                    partnerId: {"in":"header","name":"x-partner","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.confirmProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/customer_id_code',

            async function PortableProposalController_customerIdCode(request: any, response: any, next: any) {
            const args = {
                    partnerId: {"in":"header","name":"x-partner","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.customerIdCode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/cancelation_security',

            async function PortableProposalController_cancelationSecurity(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.cancelationSecurity.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/sold_proposal_cancel',

            async function PortableProposalController_cancelSoldProposal(request: any, response: any, next: any) {
            const args = {
                    orderProposal: {"in":"body","name":"orderProposal","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.cancelSoldProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/processIOF',

            async function PortableProposalController_processIOF(request: any, response: any, next: any) {
            const args = {
                    UUIDList: {"in":"body","name":"UUIDList","required":true,"dataType":"array","array":{"dataType":"any"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.processIOF.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/portable/find_by_nsu/:nsu',

            async function PortableProposalController_findByNsu(request: any, response: any, next: any) {
            const args = {
                    nsu: {"in":"path","name":"nsu","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.findByNsu.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/find_from_order_customer/:customerId/:order',

            async function PortableProposalController_findFromOrdeCustomer(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
                    order: {"in":"path","name":"order","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.findFromOrdeCustomer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/portable/update_nsu_order_customer',

            async function PortableProposalController_updateNsuByCustumerAndOrder(request: any, response: any, next: any) {
            const args = {
                    custumerInfo: {"in":"body","name":"custumerInfo","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PortableProposalController>(PortableProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateNsuByCustumerAndOrder.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/residential/maintenance/proposal/:paymentId',

            async function MaintenanceResidentialController_proposalReport(request: any, response: any, next: any) {
            const args = {
                    paymentId: {"in":"path","name":"paymentId","required":true,"dataType":"string"},
                    partner: {"in":"header","name":"x-partner","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceResidentialController>(MaintenanceResidentialController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.proposalReport.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/residential/maintenance/soldProposal/:customerId',

            async function MaintenanceResidentialController_soldProposalReport(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
                    partner: {"in":"header","name":"x-partner","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceResidentialController>(MaintenanceResidentialController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.soldProposalReport.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/residential/maintenance/soldProposal/migrate',

            async function MaintenanceResidentialController_genSoldProposal(request: any, response: any, next: any) {
            const args = {
                    partner: {"in":"header","name":"x-partner","required":true,"dataType":"string"},
                    ver: {"in":"header","name":"x-version","required":true,"dataType":"string"},
                    paymentId: {"in":"header","name":"x-paymentId","required":true,"dataType":"string"},
                    customerId: {"in":"header","name":"x-customerId","required":true,"dataType":"string"},
                    nsu: {"in":"header","name":"x-NSU","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceResidentialController>(MaintenanceResidentialController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.genSoldProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/plans/proposal-report',
            authenticateMiddleware([{"jwt":["list_proposal"]}]),

            async function OldResidentialProposalController_proposalReport(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<OldResidentialProposalController>(OldResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.proposalReport.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/plans/:zipCode/:buildType',

            async function OldResidentialProposalController_retrievePlans(request: any, response: any, next: any) {
            const args = {
                    zipCode: {"in":"path","name":"zipCode","required":true,"dataType":"string"},
                    buildType: {"in":"path","name":"buildType","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<OldResidentialProposalController>(OldResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.retrievePlans.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/plans/sendProposal',

            async function OldResidentialProposalController_sendProposal(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"ref":"ResidentialProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<OldResidentialProposalController>(OldResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/plans/proposal',
            authenticateMiddleware([{"jwt":["list_proposal"]}]),

            async function OldResidentialProposalController_listProposal(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<OldResidentialProposalController>(OldResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.listProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/residential/proposal-report',
            authenticateMiddleware([{"jwt":["list_proposal"]}]),

            async function ResidentialProposalController_proposalReport(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ResidentialProposalController>(ResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.proposalReport.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/residential/:zipCode/:buildType',

            async function ResidentialProposalController_retrievePlans(request: any, response: any, next: any) {
            const args = {
                    zipCode: {"in":"path","name":"zipCode","required":true,"dataType":"string"},
                    buildType: {"in":"path","name":"buildType","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ResidentialProposalController>(ResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.retrievePlans.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/residential/sendProposal',

            async function ResidentialProposalController_sendProposal(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"ref":"ResidentialProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ResidentialProposalController>(ResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/residential/proposal',
            authenticateMiddleware([{"jwt":["list_proposal"]}]),

            async function ResidentialProposalController_listProposal(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ResidentialProposalController>(ResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.listProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/residential/renew_proposal',

            async function ResidentialProposalController_renewProposal(request: any, response: any, next: any) {
            const args = {
                    searchValue: {"in":"body","name":"searchValue","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ResidentialProposalController>(ResidentialProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.renewProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/zipcode/:zipCode',

            async function ZipCodeController_consultZipcode(request: any, response: any, next: any) {
            const args = {
                    zipCode: {"in":"path","name":"zipCode","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ZipCodeController>(ZipCodeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.consultZipcode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/sendProposal',

            async function SmartphoneProposalController_sendProposal(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"ref":"SmartphoneProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/updateProposal/:proposalId',

            async function SmartphoneProposalController_updateProposal(request: any, response: any, next: any) {
            const args = {
                    proposalId: {"in":"path","name":"proposalId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/update_many_proposal',

            async function SmartphoneProposalController_updateManyProposal(request: any, response: any, next: any) {
            const args = {
                    proposal: {"in":"body","name":"proposal","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateManyProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/proposal/:pass/sendEmail',

            async function SmartphoneProposalController_sendMailProposal(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendMailProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/proposal/:pass/sendEmail/:email',

            async function SmartphoneProposalController_sendMailProposalToMe(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
                    email: {"in":"path","name":"email","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendMailProposalToMe.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/sold_proposal/:customerId/:order/statusUpdate',

            async function SmartphoneProposalController_statusUpdateSoldProposal(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
                    order: {"in":"path","name":"order","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.statusUpdateSoldProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/smartphone/validate_email/:pass',

            async function SmartphoneProposalController_validateMailProposal(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.validateMailProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/confirm_proposal',

            async function SmartphoneProposalController_confirmProposal(request: any, response: any, next: any) {
            const args = {
                    digibeeConfirmation: {"in":"body","name":"digibeeConfirmation","required":true,"ref":"DigibeeConfirmation"},
                    partnerId: {"in":"header","name":"x-partner","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.confirmProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/customer_id_code',

            async function SmartphoneProposalController_customerIdCode(request: any, response: any, next: any) {
            const args = {
                    partnerId: {"in":"header","name":"x-partner","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.customerIdCode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/cancelation_security',

            async function SmartphoneProposalController_cancelationSecurity(request: any, response: any, next: any) {
            const args = {
                    signedPayment: {"in":"body","name":"signedPayment","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.cancelationSecurity.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/sold_proposal_cancel',

            async function SmartphoneProposalController_cancelSoldProposal(request: any, response: any, next: any) {
            const args = {
                    orderProposal: {"in":"body","name":"orderProposal","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.cancelSoldProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/processIOF',

            async function SmartphoneProposalController_processIOF(request: any, response: any, next: any) {
            const args = {
                    UUIDList: {"in":"body","name":"UUIDList","required":true,"dataType":"array","array":{"dataType":"any"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.processIOF.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/smartphone/find_by_nsu/:nsu',

            async function SmartphoneProposalController_findByNsu(request: any, response: any, next: any) {
            const args = {
                    nsu: {"in":"path","name":"nsu","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.findByNsu.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/find_from_order_customer/:customerId/:order',

            async function SmartphoneProposalController_findFromOrdeCustomer(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
                    order: {"in":"path","name":"order","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.findFromOrdeCustomer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/smartphone/update_nsu_order_customer',

            async function SmartphoneProposalController_updateNsuByCustumerAndOrder(request: any, response: any, next: any) {
            const args = {
                    custumerInfo: {"in":"body","name":"custumerInfo","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<SmartphoneProposalController>(SmartphoneProposalController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateNsuByCustumerAndOrder.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/unusual/proposal_email/:pass/:email/sendEmail',

            async function UnusualController_sendMailProposalWithParams(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
                    email: {"in":"path","name":"email","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UnusualController>(UnusualController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendMailProposalWithParams.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/unusual/update_old_clients/:proposalId',

            async function UnusualController_updateProposal(request: any, response: any, next: any) {
            const args = {
                    proposalId: {"in":"path","name":"proposalId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UnusualController>(UnusualController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/renew-portable/portable-info/:customerId/:planType',

            async function RenewPortableController_portableInfo(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
                    planType: {"in":"path","name":"planType","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<RenewPortableController>(RenewPortableController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.portableInfo.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/renew-portable/sendProposal',

            async function RenewPortableController_sendProposal(request: any, response: any, next: any) {
            const args = {
                    proposal: {"in":"body","name":"proposal","required":true,"ref":"RenewPortableProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<RenewPortableController>(RenewPortableController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/maintenance/proposal_email/:pass/:email/sendEmail',

            async function MaintenanceController_sendMailProposalWithParams(request: any, response: any, next: any) {
            const args = {
                    pass: {"in":"path","name":"pass","required":true,"dataType":"string"},
                    email: {"in":"path","name":"email","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceController>(MaintenanceController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.sendMailProposalWithParams.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ame-seguro-residencial/v1/maintenance/update_old_clients/:proposalId',

            async function MaintenanceController_updateProposal(request: any, response: any, next: any) {
            const args = {
                    proposalId: {"in":"path","name":"proposalId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceController>(MaintenanceController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updateProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/maintenance/update-plan-type',

            async function MaintenanceController_updatePlanType(request: any, response: any, next: any) {
            const args = {
                    updatePlanStatus: {"in":"body","name":"updatePlanStatus","required":true,"ref":"MaintenanceUpdatePlanNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceController>(MaintenanceController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.updatePlanType.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/maintenance/residential-resend-proposal',

            async function MaintenanceController_residentialResendProposal(request: any, response: any, next: any) {
            const args = {
                    proposal: {"in":"body","name":"proposal","required":true,"ref":"MaintenanceProposalNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceController>(MaintenanceController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.residentialResendProposal.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/maintenance/cancelled-orders',

            async function MaintenanceController_canceledOrders(request: any, response: any, next: any) {
            const args = {
                    customer: {"in":"body","name":"customer","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceController>(MaintenanceController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.canceledOrders.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/maintenance/insert_dynamo',

            async function MaintenanceController_insertDynamo(request: any, response: any, next: any) {
            const args = {
                    info: {"in":"body","name":"info","required":true,"ref":"MaintenanceNotification"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceController>(MaintenanceController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.insertDynamo.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ame-seguro-residencial/v1/maintenance/insert_luck_number',

            async function MaintenanceController_insertLuckNumber(request: any, response: any, next: any) {
            const args = {
                    info: {"in":"body","name":"info","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MaintenanceController>(MaintenanceController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.insertLuckNumber.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny(secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"silently-remove-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"silently-remove-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"silently-remove-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"silently-remove-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"silently-remove-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"silently-remove-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"silently-remove-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"silently-remove-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
