/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './inversify/inversify.config';
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
import { MaintenanceController } from './modules/maintenance/controllers/MaintenanceController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PetProposalController } from './modules/petProposal/controllers/PetProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OldResidentialProposalController } from './modules/residentialProposal/controllers/OldResidentialProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ResidentialProposalController } from './modules/residentialProposal/controllers/ResidentialProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ZipCodeController } from './modules/residentialProposal/controllers/ZipCodeController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SmartphoneProposalController } from './modules/smartphoneProposal/controllers/SmartphoneProposalController';
import { expressAuthentication } from './middleware/authentication';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "HealthCareProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": { "dataType": "string", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PetProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": { "dataType": "string", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResidentialProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": { "dataType": "string", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SmartphoneProposalNotification": {
        "dataType": "refObject",
        "properties": {
            "signedPayment": { "dataType": "string", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DigibeeConfirmation": {
        "dataType": "refObject",
        "properties": {
            "control_data": { "dataType": "nestedObjectLiteral", "nestedProperties": { "rejection_description": { "dataType": "string", "required": true }, "rejection_reason_code": { "dataType": "double", "required": true }, "sequential_shipping_number": { "dataType": "double", "required": true }, "shipping_file_number": { "dataType": "double", "required": true }, "acceptance_type": { "dataType": "string", "required": true }, "processing_data": { "dataType": "string", "required": true }, "key_contract_certificate_number": { "dataType": "string", "required": true } }, "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/ame-seguro-residencial/health',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<HealthController>(HealthController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.health.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/health/test',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<HealthController>(HealthController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.test.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/healthcare/sendProposal',
        function(request: any, response: any, next: any) {
            const args = {
                signedPayment: { "in": "body", "name": "signedPayment", "required": true, "ref": "HealthCareProposalNotification" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<healthCareProposalController>(healthCareProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/healthcare/cancelProposal',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<healthCareProposalController>(healthCareProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.cancelProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/hub/plans/:customerId',
        function(request: any, response: any, next: any) {
            const args = {
                customerId: { "in": "path", "name": "customerId", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<HubController>(HubController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.retrievePlans.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/hub/rawplans/:customerId',
        function(request: any, response: any, next: any) {
            const args = {
                customerId: { "in": "path", "name": "customerId", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<HubController>(HubController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.retrieveRawPlans.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/hub/plans/:customerId/:orderId/remove',
        function(request: any, response: any, next: any) {
            const args = {
                customerId: { "in": "path", "name": "customerId", "required": true, "dataType": "string" },
                orderId: { "in": "path", "name": "orderId", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<HubController>(HubController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.removePlan.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/hub/configs/:key',
        function(request: any, response: any, next: any) {
            const args = {
                key: { "in": "path", "name": "key", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<HubController>(HubController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.retrieveConfigs.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/hub/tables/:key',
        function(request: any, response: any, next: any) {
            const args = {
                key: { "in": "path", "name": "key", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<HubController>(HubController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.checkTables.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/life/cotation',
        function(request: any, response: any, next: any) {
            const args = {
                cotation: { "in": "body", "name": "cotation", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<LifeProposalController>(LifeProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.cotationPlan.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/life/proposal',
        function(request: any, response: any, next: any) {
            const args = {
                signedPayment: { "in": "body", "name": "signedPayment", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<LifeProposalController>(LifeProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.propose.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/maintenance/proposal_email/:pass/:email/sendEmail',
        function(request: any, response: any, next: any) {
            const args = {
                pass: { "in": "path", "name": "pass", "required": true, "dataType": "string" },
                email: { "in": "path", "name": "email", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<MaintenanceController>(MaintenanceController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendMailProposalWithParams.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/maintenance/update_old_clients/:proposalId',
        function(request: any, response: any, next: any) {
            const args = {
                proposalId: { "in": "path", "name": "proposalId", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<MaintenanceController>(MaintenanceController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.updateProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/maintenance/update-plan-type',
        function(request: any, response: any, next: any) {
            const args = {
                proposal: { "in": "body", "name": "proposal", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<MaintenanceController>(MaintenanceController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.updatePlanType.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/pet/planList',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PetProposalController>(PetProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.planList.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/pet/petDescPlan/:idPlan',
        function(request: any, response: any, next: any) {
            const args = {
                idPlan: { "in": "path", "name": "idPlan", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PetProposalController>(PetProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.descPetList.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/pet/sendProposal',
        function(request: any, response: any, next: any) {
            const args = {
                signedPayment: { "in": "body", "name": "signedPayment", "required": true, "ref": "PetProposalNotification" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PetProposalController>(PetProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/pet/quote/:idPlan',
        function(request: any, response: any, next: any) {
            const args = {
                idPlan: { "in": "path", "name": "idPlan", "required": true, "dataType": "string" },
                petQuotationPlan: { "in": "body", "name": "petQuotationPlan", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PetProposalController>(PetProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.quotationPetPlans.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/plans/proposal-report',
        authenticateMiddleware([{ "jwt": ["list_proposal"] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<OldResidentialProposalController>(OldResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.proposalReport.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/plans/:zipCode/:buildType',
        function(request: any, response: any, next: any) {
            const args = {
                zipCode: { "in": "path", "name": "zipCode", "required": true, "dataType": "string" },
                buildType: { "in": "path", "name": "buildType", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<OldResidentialProposalController>(OldResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.retrievePlans.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/plans/sendProposal',
        function(request: any, response: any, next: any) {
            const args = {
                signedPayment: { "in": "body", "name": "signedPayment", "required": true, "ref": "ResidentialProposalNotification" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<OldResidentialProposalController>(OldResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/plans/proposal',
        authenticateMiddleware([{ "jwt": ["list_proposal"] }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<OldResidentialProposalController>(OldResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.listProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/residential/proposal-report',
        authenticateMiddleware([{ "jwt": ["list_proposal"] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ResidentialProposalController>(ResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.proposalReport.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/residential/:zipCode/:buildType',
        function(request: any, response: any, next: any) {
            const args = {
                zipCode: { "in": "path", "name": "zipCode", "required": true, "dataType": "string" },
                buildType: { "in": "path", "name": "buildType", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ResidentialProposalController>(ResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.retrievePlans.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/residential/sendProposal',
        function(request: any, response: any, next: any) {
            const args = {
                signedPayment: { "in": "body", "name": "signedPayment", "required": true, "ref": "ResidentialProposalNotification" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ResidentialProposalController>(ResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/residential/proposal',
        authenticateMiddleware([{ "jwt": ["list_proposal"] }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ResidentialProposalController>(ResidentialProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.listProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/zipcode/:zipCode',
        function(request: any, response: any, next: any) {
            const args = {
                zipCode: { "in": "path", "name": "zipCode", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ZipCodeController>(ZipCodeController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.consultZipcode.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/sendProposal',
        function(request: any, response: any, next: any) {
            const args = {
                signedPayment: { "in": "body", "name": "signedPayment", "required": true, "ref": "SmartphoneProposalNotification" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/updateProposal/:proposalId',
        function(request: any, response: any, next: any) {
            const args = {
                proposalId: { "in": "path", "name": "proposalId", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.updateProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/update_many_proposal',
        function(request: any, response: any, next: any) {
            const args = {
                proposal: { "in": "body", "name": "proposal", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.updateManyProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/proposal/:pass/sendEmail',
        function(request: any, response: any, next: any) {
            const args = {
                pass: { "in": "path", "name": "pass", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendMailProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/proposal/:pass/sendEmail/:email',
        function(request: any, response: any, next: any) {
            const args = {
                pass: { "in": "path", "name": "pass", "required": true, "dataType": "string" },
                email: { "in": "path", "name": "email", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendMailProposalToMe.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/sold_proposal/:customerId/:order/statusUpdate',
        function(request: any, response: any, next: any) {
            const args = {
                customerId: { "in": "path", "name": "customerId", "required": true, "dataType": "string" },
                order: { "in": "path", "name": "order", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.statusUpdateSoldProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/smartphone/validate_email/:pass',
        function(request: any, response: any, next: any) {
            const args = {
                pass: { "in": "path", "name": "pass", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.validateMailProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/confirm_proposal',
        function(request: any, response: any, next: any) {
            const args = {
                digibeeConfirmation: { "in": "body", "name": "digibeeConfirmation", "required": true, "ref": "DigibeeConfirmation" },
                partnerId: { "in": "header", "name": "x-partner", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.confirmProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/customer_id_code',
        function(request: any, response: any, next: any) {
            const args = {
                partnerId: { "in": "header", "name": "x-partner", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.customerIdCode.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/cancelation_security',
        function(request: any, response: any, next: any) {
            const args = {
                signedPayment: { "in": "body", "name": "signedPayment", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.cancelationSecurity.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/sold_proposal_cancel',
        function(request: any, response: any, next: any) {
            const args = {
                orderProposal: { "in": "body", "name": "orderProposal", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.cancelSoldProposal.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/processIOF',
        function(request: any, response: any, next: any) {
            const args = {
                UUIDList: { "in": "body", "name": "UUIDList", "required": true, "dataType": "array", "array": { "dataType": "any" } },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.processIOF.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ame-seguro-residencial/v1/smartphone/find_by_nsu/:nsu',
        function(request: any, response: any, next: any) {
            const args = {
                nsu: { "in": "path", "name": "nsu", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.findByNsu.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/find_from_order_customer/:customerId/:order',
        function(request: any, response: any, next: any) {
            const args = {
                customerId: { "in": "path", "name": "customerId", "required": true, "dataType": "string" },
                order: { "in": "path", "name": "order", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.findFromOrdeCustomer.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ame-seguro-residencial/v1/smartphone/update_nsu_order_customer',
        function(request: any, response: any, next: any) {
            const args = {
                custumerInfo: { "in": "body", "name": "custumerInfo", "required": true, "dataType": "any" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<SmartphoneProposalController>(SmartphoneProposalController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.updateNsuByCustumerAndOrder.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = error.status || 401;
                    next(error)
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
                    data.pipe(response);
                } else if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "specVersion": 3 });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "specVersion": 3 });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "specVersion": 3 });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.', { "specVersion": 3 });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "specVersion": 3 });
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
