'use client';

import { useState, useEffect } from 'react';
import {
    Stack,
    Box,
    Input,
    Textarea,
    Button,
    RadioGroup,
    Field,
    Checkbox,
    Progress,
    HStack,
    Text,
    Alert,
    NativeSelect,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { PortableText, PortableTextBlock } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { BOOK_KURS_PAGE_QUERY } from '@/sanity/lib/queries';
import { portableTextComponents } from './Typography';
import { SubsectionHeading } from './Typography';

// Temporary type definition - will be replaced when typegen is run
type BookKursPage = {
    _id: string;
    step1Content?: PortableTextBlock[];
};

export default function BookKursForm() {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    // Calculate progress value based on current step (e.g., Step 1 = 25%, Step 2 = 50%...)
    const progressValue = (step / totalSteps) * 100;

    const [formData, setFormData] = useState({
        deltakermasse: '',
        kontaktpersonNavn: '',
        kontaktpersonTelefon: '',
        kontaktpersonEpost: '',
        fraDato: '',
        tilDato: '',
        antallDeltakere: '',
        kursType: '',
        kursTypeAnnet: '',
        sted: 'eget',
        adresse: '',
        annet: '',
        kursbevis: false,
        engelskKurs: false,
    });

    const [pageContent, setPageContent] = useState<BookKursPage | null>(null);
    const [contentLoading, setContentLoading] = useState(true);

    useEffect(() => {
        client
            .fetch<BookKursPage>(BOOK_KURS_PAGE_QUERY)
            .then((data) => {
                setPageContent(data);
                setContentLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching booking page content:', error);
                setContentLoading(false);
            });
    }, []);

    const [loading, setLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step < totalSteps) {
            nextStep();
            return;
        }

        setLoading(true);
        setSubmissionStatus('idle');
        setValidationError(null);

        const payload = {
            ...formData,
            datoer: `${formData.fraDato} til ${formData.tilDato}`,
        };

        console.log('Form Submitted:', payload);

        try {
            const response = await fetch("/api/gcloud", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("API Error Response:", errData);
                throw new Error(errData.error || response.statusText);
            }

            setLoading(false);
            setSubmissionStatus('success');
            setSubmissionMessage('Takk for din henvendelse! Vi tar kontakt med deg så snart som mulig.');
            // Optional: reset form or redirect here if needed
        } catch (error) {
            console.error(error);
            setLoading(false);
            setSubmissionStatus('error');
            setSubmissionMessage('Noe gikk galt. Vennligst prøv igjen senere.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear validation error when user types
        if (validationError) setValidationError(null);
    };

    const nextStep = () => {
        if (step === 2) {
            if (!formData.kontaktpersonNavn || !formData.kontaktpersonEpost) {
                setValidationError('Vennligst fyll ut navn og epost til kontaktperson.');
                return;
            }
            // Simple email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.kontaktpersonEpost)) {
                setValidationError('Vennligst oppgi en gyldig e-postadresse.');
                return;
            }
        }
        if (step === 3) {
            if (!formData.kursType) {
                setValidationError('Vennligst velg et kurs.');
                return;
            }
            if (formData.kursType === "Annet" && !formData.kursTypeAnnet) {
                setValidationError('Vennligst spesifiser mer om hva du ønsker.');
                return;
            }
            if (!formData.antallDeltakere) {
                setValidationError('Vennligst oppgi antall deltakere.');
                return;
            }
        }
        if (step === 4) {
            if (!formData.fraDato || !formData.tilDato) {
                setValidationError('Vennligst oppgi datoer.');
                return;
            }
            if (!formData.sted) {
                setValidationError('Vennligst oppgi sted.');
                return;
            }
            if (formData.sted === 'eget' && !formData.adresse) {
                setValidationError('Vennligst oppgi adresse.');
                return;
            }
        }
        setValidationError(null);
        setStep((prev) => Math.min(prev + 1, totalSteps));
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setValidationError(null);
        setStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    if (submissionStatus === 'success') {
        return (
            <Box maxWidth="600px" mx="auto" p={6} borderRadius="lg" bg="white" boxShadow="md">
                <Alert.Root status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                    <Alert.Indicator fontSize="3xl" />
                    <Alert.Title fontSize="xl" mt={4} mb={2}>Bestilling mottatt!</Alert.Title>
                    <Alert.Description>
                        {submissionMessage}
                    </Alert.Description>
                </Alert.Root>
            </Box>
        );
    }

    return (
        <Box as="form" onSubmit={handleSubmit} maxWidth="600px" mx="auto" p={6} borderRadius="lg" bg="white" boxShadow="md">

            <Box mb={8}>
                <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.600">Steg {step} av {totalSteps}</Text>
                    <Text fontSize="sm" color="gray.500">{Math.round(progressValue)}% ferdig</Text>
                </HStack>
                <Progress.Root value={progressValue} size="sm" colorScheme="red">
                    <Progress.Track>
                        <Progress.Range bg="var(--color-primary)" />
                    </Progress.Track>
                </Progress.Root>
            </Box>

            <Stack gap={6} minH="300px">

                {validationError && (
                    <Alert.Root status="error" mb={4}>
                        <Alert.Indicator />
                        <Alert.Title>Mangler informasjon</Alert.Title>
                        <Alert.Description>{validationError}</Alert.Description>
                    </Alert.Root>
                )}

                {/* STEP 1: Priser og Info */}
                {step === 1 && (
                    <Box animation="fade-in 0.3s">
                        <SubsectionHeading fontSize="1.2rem" mb={4}>Priser og Informasjon</SubsectionHeading>
                        {contentLoading ? (
                            <Center minH="200px">
                                <Spinner size="xl" color="var(--color-primary)" />
                            </Center>
                        ) : pageContent?.step1Content ? (
                            <Stack gap={4}>
                                <Box p={4} bg="gray.50" borderRadius="md" border="1px dashed" borderColor="gray.300">
                                    <PortableText
                                        value={pageContent.step1Content}
                                        components={portableTextComponents}
                                    />
                                </Box>
                                <Alert.Root status="info">
                                    <Alert.Title>Avbestilling</Alert.Title>
                                    <Alert.Description>
                                        Avbestilling må skje senest to uker før oppdraget.
                                    </Alert.Description>
                                </Alert.Root>
                                <Box fontSize="sm" color="gray.600">
                                    <Text mb={2}>
                                        Vi gjør oppmerksom på at vi vil kunne lagre informasjonen i bestillingsskjemaet i opptil 2 år etter innsending.
                                    </Text>
                                </Box>
                            </Stack>
                        ) : (
                            <Stack gap={4}>
                                <Alert.Root status="warning">
                                    <Alert.Indicator />
                                    <Alert.Title>Innhold ikke tilgjengelig</Alert.Title>
                                    <Alert.Description>
                                        Kunne ikke laste inn innhold. Vennligst prøv igjen senere.
                                    </Alert.Description>
                                </Alert.Root>
                            </Stack>
                        )}
                    </Box>
                )}

                {/* STEP 2: Kontaktinfo */}

                {step === 2 && (
                    <Box animation="fade-in 0.3s">
                        <SubsectionHeading fontSize="1.2rem" mb={4}>Kontaktinformasjon</SubsectionHeading>
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Navn på kontaktperson <Text as="span" color="red.500">*</Text></Field.Label>
                                <Input
                                    name="kontaktpersonNavn"
                                    value={formData.kontaktpersonNavn}
                                    onChange={handleChange}
                                    placeholder="Ola Nordmann"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Telefonnummer</Field.Label>
                                <Input
                                    name="kontaktpersonTelefon"
                                    value={formData.kontaktpersonTelefon}
                                    onChange={handleChange}
                                    type="tel"
                                    placeholder="123 45 678"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>E-postadresse <Text as="span" color="red.500">*</Text></Field.Label>
                                <Input
                                    name="kontaktpersonEpost"
                                    value={formData.kontaktpersonEpost}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="navn@bedrift.no"
                                />
                            </Field.Root>
                        </Stack>
                    </Box>
                )}

                {/* STEP 3: Kursdetaljer */}
                {step === 3 && (
                    <Box animation="fade-in 0.3s">
                        <SubsectionHeading fontSize="1.2rem" mb={4}>Kursdetaljer</SubsectionHeading>
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Hvilket kurs vil du bestille?<Text as="span" color="red.500">*</Text></Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        name="kursType"
                                        value={formData.kursType}
                                        onChange={handleChange}
                                        placeholder="Velg et kurs..."

                                    >
                                        <option value="TrAMS Standard Eksternkurs (ABC+BHLR+Case)">TrAMS Standard Eksternkurs (ABC+BHLR+Case)</option>
                                        <option value="NRR-sertifisert GHLR-kurs">NRR-sertifisert GHLR-kurs</option>
                                        <option value="Annet">Annet (vennligst spesifiser)</option>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                                {formData.kursType === "Annet" && (
                                    <Input
                                        name="kursTypeAnnet"
                                        value={formData.kursTypeAnnet}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Spesifiser mer om hva du ønsker..."
                                    />
                                )}
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Hvem er deltakermassen?</Field.Label>
                                <Textarea
                                    name="deltakermasse"
                                    value={formData.deltakermasse}
                                    onChange={handleChange}
                                    placeholder="Beskriv gruppen (alder, bakgrunn...)"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Antall deltakere<Text as="span" color="red.500">*</Text></Field.Label>
                                <Input
                                    name="antallDeltakere"
                                    value={formData.antallDeltakere}
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="Ca. antall"
                                />
                            </Field.Root>
                        </Stack>
                    </Box>
                )}

                {/* STEP 4: Logistikk (Tid og Sted) */}
                {step === 4 && (
                    <Box animation="fade-in 0.3s">
                        <SubsectionHeading fontSize="1.2rem" mb={4}>Tid og Sted</SubsectionHeading>
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Når passer det?<Text as="span" color="red.500">*</Text></Field.Label>
                                <HStack gap={4}>
                                    <Box width="100%">
                                        <Text fontSize="sm" mb={1} color="gray.600">Tidligste dato</Text>
                                        <Input
                                            type="date"
                                            name="fraDato"
                                            value={formData.fraDato}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                    <Box width="100%">
                                        <Text fontSize="sm" mb={1} color="gray.600">Seneste dato</Text>
                                        <Input
                                            type="date"
                                            name="tilDato"
                                            value={formData.tilDato}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                </HStack>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label mb={2}>Hvor ønsker dere kurset?<Text as="span" color="red.500">*</Text></Field.Label>
                                <RadioGroup.Root
                                    name="sted"
                                    value={formData.sted}
                                    onValueChange={(details) => setFormData(prev => ({ ...prev, sted: details.value || '' }))}
                                >
                                    <Stack direction="row" gap={4}>
                                        <RadioGroup.Item value="eget">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>Eget lokale</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="helsehus">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>Øya Helsehus (vi stiller med loklaler)</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                    </Stack>
                                </RadioGroup.Root>
                                {formData.sted === 'eget' && (
                                    <Field.Root>
                                        <Field.Label>Adresse<Text as="span" color="red.500">*</Text></Field.Label>
                                        <Input
                                            name="adresse"
                                            value={formData.adresse}
                                            onChange={handleChange}
                                            placeholder="Adresse"
                                        />
                                    </Field.Root>
                                )}
                            </Field.Root>
                        </Stack>
                    </Box>
                )}

                {/* STEP 5: Avslutning */}
                {step === 5 && (
                    <Box animation="fade-in 0.3s">
                        <SubsectionHeading fontSize="1.2rem" mb={4}>Annet</SubsectionHeading>
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Noe annet du vil legge til?</Field.Label>
                                <Textarea
                                    name="annet"
                                    value={formData.annet}
                                    onChange={handleChange}
                                    placeholder="Spesielle behov eller andre spørsmål..."
                                    rows={4}
                                />
                            </Field.Root>

                            <Checkbox.Root
                                name="kursbevis"
                                checked={formData.kursbevis}
                                onCheckedChange={(details) => setFormData(prev => ({ ...prev, kursbevis: !!details.checked }))}
                                mt={2}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>Vi ønsker kursbevis til deltakerne</Checkbox.Label>
                            </Checkbox.Root>

                            <Checkbox.Root
                                name="engelskKurs"
                                checked={formData.engelskKurs}
                                onCheckedChange={(details) => setFormData(prev => ({ ...prev, engelskKurs: !!details.checked }))}
                                mt={2}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>Kurset skal holdes på engelsk</Checkbox.Label>
                            </Checkbox.Root>
                        </Stack>
                    </Box>
                )}

                {submissionStatus === 'error' && (
                    <Alert.Root status="error" mt={4}>
                        <Alert.Indicator />
                        <Alert.Title>Feil under sending</Alert.Title>
                        <Alert.Description>{submissionMessage}</Alert.Description>
                    </Alert.Root>
                )}

                {/* Navigation Buttons */}
                <HStack justify="space-between" mt={4} pt={4} borderTop="1px solid" borderColor="gray.100">
                    <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        disabled={step === 1}
                        opacity={step === 1 ? 0 : 1} // Hide on first step but keep layout
                        pointerEvents={step === 1 ? 'none' : 'auto'}
                    >
                        Tilbake
                    </Button>

                    {/* Key ensures buttons are re-created on step change, preventing stuck focus or accidental double-submits */}
                    <Box key={step}>
                        {step < totalSteps ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                bg="var(--color-primary)"
                                color="white"
                                _hover={{ bg: "red.600" }}
                            >
                                {step === 1 ? "Start bestilling" : "Neste"}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                loading={loading}
                                bg="var(--color-primary)"
                                color="white"
                                _hover={{ bg: "red.600" }}
                            >
                                Send bestilling
                            </Button>
                        )}
                    </Box>
                </HStack>

            </Stack>
        </Box>
    );
}
