import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { SimpleGrid, Heading, Text, Button, Image } from '@chakra-ui/react';
import Navbar from '../../components/NavBar'
import Footer from '../../components/Footer'


export default function About() {
    return (
        <div>
            <Navbar />
            <div className="w-full h-full bg-white py-20">
                <h1 className="text-6xl text-center pt-2 text-black font-raleway py-6">About Us</h1>
                <div className="mx-auto w-3/5">
                    <p className="text-black text-lg">
                        This is a real-time AI-based Yoga Trainer that evaluates how well you are performing your yoga poses. We, a team of 5 AI and Data Science students, created this as part of our college semester mini project. The project is deployed so that others can benefit from it.
                        The AI first identifies keypoints or coordinates of different body parts (indicating their location in an image) and uses a classification model to recognize the pose being performed. If the AI determines that the pose is being done with over 95% accuracy, it will notify you that you are performing it correctly by changing the virtual skeleton's color to green. We utilized TensorFlow's pre-trained MoveNet model to predict the keypoints and then built a neural network on top of it to classify yoga poses.
                        The model was trained in Python, and we leveraged TensorFlow.js to deploy the model in the browser."
                    </p>
                    <div className="mt-5">
                        <h4 className="text-3xl text-Black font-raleway underline">About Developers</h4>
                        <p className="text-black text-lg m-4">We are Team-5 from 2nd Year AI & Data Science 2024. By nature, we are AI Developers and Full Stack enthusiasts.</p>
                    </div>
                    <div>

                        <SimpleGrid
                            spacing={4}
                            templateColumns='repeat(auto-fill, minmax(150px, 1fr))'
                            className="flex justify-center items-center"
                            justifyItems="center"
                            alignItems="center"
                        >
                            <Card className='border border-[#242F2A] p-2'>
                                <CardHeader>
                                    <Heading size='md'>Ugyen Dendup</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Image
                                        src="/images/members/member5.png"
                                        alt="Customer Dashboard"
                                        mb={2}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <Button>FullStack Developer</Button>
                                </CardFooter>
                            </Card>
                            <Card className='border border-[#242F2A] p-2'>
                                <CardHeader>
                                    <Heading size='md'>Vibek Tamang</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Image
                                        src="/images/members/member3.png"
                                        alt="Customer Dashboard"
                                        mb={2}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <Button>UI/UX Designer</Button>
                                </CardFooter>
                            </Card>
                            <Card className='border border-[#242F2A] p-2'>
                                <CardHeader>
                                    <Heading size='md'>Yoedsel Namgay</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Image
                                        src="/images/members/member1.png"
                                        alt="Customer Dashboard"
                                        mb={2}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <Button>Frontend Developer</Button>
                                </CardFooter>
                            </Card>
                            <Card className='border border-[#242F2A] p-2'>
                                <CardHeader>
                                    <Heading size='md'>Tshering Gyeltshen</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Image
                                        src="/images/members/member4.png"
                                        alt="Customer Dashboard"
                                        mb={2}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <Button>AI Developer</Button>
                                </CardFooter>
                            </Card>
                            <Card className='border border-[#242F2A] p-2'>
                                <CardHeader>
                                    <Heading size='md'>Yeshey Dema</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Image
                                        src="/images/members/member2.png"
                                        alt="Customer Dashboard"
                                        mb={2}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <Button>Data Engineer</Button>
                                </CardFooter>
                            </Card>
                        </SimpleGrid>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
