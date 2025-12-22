import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export class Documentacion {
    private readonly spec: object;
    private readonly uiOptions: any; // Tipado interno del adaptador

    constructor() {
        const swaggerOptions: Options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Documentacion REST API MiniMarket Express Typescript G1',
                    version: '1.0.0',
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                    },
                },
            },
            apis: ['./src/app/**/*.route.ts', './src/data/models/**/*.model.ts'],
        };

        this.spec = swaggerJsdoc(swaggerOptions);

        this.uiOptions = {
            customCss: `
            .topbar-wrapper .link {
                content: url('https://purina.com.ec/sites/default/files/styles/webp/public/2022-10/purina-10-datos-curiosos-sobre-los-gatos.png.webp?itok=rg1FkRuN');
                height: 80px;
                width: auto;
            }
            `,
            customSiteTitle: 'Documentacion REST API MiniMarket Express Typescript G1'
        };
    }

    // Encapsulamos swaggerUi.serve y swaggerUi.setup en métodos del adaptador
    public get serve() {
        return swaggerUi.serve;
    }

    public setup() {
        return swaggerUi.setup(this.spec, this.uiOptions);
    }
}