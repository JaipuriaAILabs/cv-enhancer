from typing import Type
import json
import PyPDF2

import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

# Initialize OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
MODEL = "gpt-4o-mini"

def Markdown2JsonTool(markdown_txt: str) -> str:
    """
    A tool for converting markdown to json.
    """

    system_prompt = r"""

    You are a professional resume writer experienced in technical domains pertaining to Web Development. You are also aware of the JSON file format and must remember that the keys of the JSON file should not be changed, only the values inside of them.

    You are free to rewrite the content in any field except for the values under keys such as "id", "url" or any of the entries under "metadata".

    - Make sure that the JSON file is valid. i.e. emails are valid, phone numbers are valid, urls are valid, etc. If the data is not present, just use "" as the value.
    - DO NOT HALLUCINATE INFORMATION. IF YOU ARE NOT SURE ABOUT THE INFORMATION, JUST USE "" AS THE VALUE.

        Your job is to scan a markdown version of the resume that the user provides and convert it into the JSON structure i have pasted below: 

        ```
    json
    {
    "basics": {
        "url": {
        "href": "https://johndoe.me/",
        "label": ""
        },
        "name": "John Doe",
        "email": "john.doe@gmail.com",
        "phone": "(555) 123-4567",
        "picture": {
        "url": "https://i.imgur.com/HgwyOuJ.jpg",
        "size": 120,
        "effects": {
            "border": false,
            "hidden": false,
            "grayscale": false
        },
        "aspectRatio": 1,
        "borderRadius": 0
        },
        "headline": "Creative and Innovative Web Developer",
        "location": "Pleasantville, CA 94588",
        "customFields": []
    },
    "metadata": {
        "css": {
        "value": "* {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}",
        "visible": false
        },
        "page": {
        "format": "a4",
        "margin": 14,
        "options": {
            "breakLine": true,
            "pageNumbers": true
        }
        },
        "notes": "",
        "theme": {
        "text": "#000000",
        "primary": "#ca8a04",
        "background": "#ffffff"
        },
        "layout": [
        [
            [
            "summary",
            "experience",
            "education",
            "projects",
            "references"
            ],
            [
            "profiles",
            "skills",
            "certifications",
            "interests",
            "languages",
            "awards",
            "volunteer",
            "publications"
            ]
        ]
        ],
        "template": "bronzor",
        "typography": {
        "font": {
            "size": 13,
            "family": "Merriweather",
            "subset": "latin",
            "variants": [
            "regular"
            ]
        },
        "hideIcons": false,
        "lineHeight": 1.75,
        "underlineLinks": true
        }
    },
    "sections": {
        "awards": {
        "id": "awards",
        "name": "Awards",
        "items": [
            {
            "id": "f2sv5z0cce6ztjl87yuk8fak",
            "url": {
                "href": "",
                "label": ""
            },
            "title": "...",
            "summary": "...",
            "visible": true,
            "description": "...",
            "awarder": "...",
            "date": "..."
            }
        ],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "custom": {},
        "skills": {
        "id": "skills",
        "name": "Skills",
        "items": [
            {
            "id": "hn0keriukh6c0ojktl9gsgjm",
            "name": "Web Technologies",
            "level": 0,
            "visible": true,
            "keywords": [
                "HTML5",
                "JavaScript",
                "PHP",
                "Python"
            ],
            "description": "Advanced"
            },
            {
            "id": "r8c3y47vykausqrgmzwg5pur",
            "name": "Web Frameworks",
            "level": 0,
            "visible": true,
            "keywords": [
                "React.js",
                "Angular",
                "Vue.js",
                "Laravel",
                "Django"
            ],
            "description": "Intermediate"
            },
            {
            "id": "b5l75aseexqv17quvqgh73fe",
            "name": "Tools",
            "level": 0,
            "visible": true,
            "keywords": [
                "Webpack",
                "Git",
                "Jenkins",
                "Docker",
                "JIRA"
            ],
            "description": "Intermediate"
            }
        ],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "summary": {
        "id": "summary",
        "name": "Summary",
        "columns": 1,
        "content": "<p>Innovative Web Developer with 5 years of experience in building impactful and user-friendly websites and applications. Specializes in <strong>front-end technologies</strong> and passionate about modern web standards and cutting-edge development techniques. Proven track record of leading successful projects from concept to deployment.</p>",
        "visible": true,
        "separateLinks": true
        },
        "profiles": {
        "id": "profiles",
        "name": "Profiles",
        "items": [
            {
            "id": "cnbk5f0aeqvhx69ebk7hktwd",
            "url": {
                "href": "https://linkedin.com/in/johndoe",
                "label": ""
            },
            "icon": "linkedin",
            "network": "LinkedIn",
            "visible": true,
            "username": "johndoe"
            },
            {
            "id": "ukl0uecvzkgm27mlye0wazlb",
            "url": {
                "href": "https://github.com/johndoe",
                "label": ""
            },
            "icon": "github",
            "network": "GitHub",
            "visible": true,
            "username": "johndoe"
            }
        ],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "projects": {
        "id": "projects",
        "name": "Projects",
        "items": [
            {
            "id": "yw843emozcth8s1ubi1ubvlf",
            "url": {
                "href": "",
                "label": ""
            },
            "date": "",
            "name": "E-Commerce Platform",
            "summary": "<p>Led the development of a full-stack e-commerce platform, improving sales conversion by 25%.</p>",
            "visible": true,
            "keywords": [],
            "description": "Project Lead"
            },
            {
            "id": "ncxgdjjky54gh59iz2t1xi1v",
            "url": {
                "href": "",
                "label": ""
            },
            "date": "",
            "name": "Interactive Dashboard",
            "summary": "<p>Created an interactive analytics dashboard for a SaaS application, enhancing data visualization for clients.</p>",
            "visible": true,
            "keywords": [],
            "description": "Frontend Developer"
            }
        ],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "education": {
        "id": "education",
        "name": "Education",
        "items": [
            {
            "id": "yo3p200zo45c6cdqc6a2vtt3",
            "url": {
                "href": "",
                "label": ""
            },
            "area": "Berkeley, CA",
            "date": "August 2012 to May 2016",
            "score": "",
            "summary": "",
            "visible": true,
            "studyType": "Bachelor's in Computer Science",
            "institution": "University of California"
            }
        ],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "interests": {
        "id": "interests",
        "name": "Interests",
        "items": [],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "languages": {
        "id": "languages",
        "name": "Languages",
        "items": [],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "volunteer": {
        "id": "volunteer",
        "name": "Volunteering",
        "items": [],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "experience": {
        "id": "experience",
        "name": "Experience",
        "items": [
            {
            "id": "lhw25d7gf32wgdfpsktf6e0x",
            "url": {
                "href": "https://creativesolutions.inc/",
                "label": ""
            },
            "date": "January 2019 to Present",
            "company": "Creative Solutions Inc.",
            "summary": "<ul><li><p>Spearheaded the redesign of the main product website, resulting in a 40% increase in user engagement.</p></li><li><p>Developed and implemented a new responsive framework, improving cross-device compatibility.</p></li><li><p>Mentored a team of four junior developers, fostering a culture of technical excellence.</p></li></ul>",
            "visible": true,
            "location": "San Francisco, CA",
            "position": "Senior Web Developer"
            },
            {
            "id": "r6543lil53ntrxmvel53gbtm",
            "url": {
                "href": "https://techadvancers.com/",
                "label": ""
            },
            "date": "June 2016 to December 2018",
            "company": "TechAdvancers",
            "summary": "<ul><li><p>Collaborated in a team of 10 to develop high-quality web applications using React.js and Node.js.</p></li><li><p>Managed the integration of third-party services such as Stripe for payments and Twilio for SMS services.</p></li><li><p>Optimized application performance, achieving a 30% reduction in load times.</p></li></ul>",
            "visible": true,
            "location": "San Jose, CA",
            "position": "Web Developer"
            }
        ],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "references": {
        "id": "references",
        "name": "References",
        "items": [
            {
            "id": "f2sv5z0cce6ztjl87yuk8fak",
            "url": {
                "href": "",
                "label": ""
            },
            "name": "Available upon request",
            "summary": "",
            "visible": true,
            "description": ""
            }
        ],
        "columns": 1,
        "visible": false,
        "separateLinks": true
        },
        "publications": {
        "id": "publications",
        "name": "Publications",
        "items": [],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        },
        "certifications": {
        "id": "certifications",
        "name": "Certifications",
        "items": [
            {
            "id": "spdhh9rrqi1gvj0yqnbqunlo",
            "url": {
                "href": "",
                "label": ""
            },
            "date": "2020",
            "name": "Full-Stack Web Development",
            "issuer": "CodeAcademy",
            "summary": "",
            "visible": true
            },
            {
            "id": "n838rddyqv47zexn6cxauwqp",
            "url": {
                "href": "",
                "label": ""
            },
            "date": "2019",
            "name": "AWS Certified Developer",
            "issuer": "Amazon Web Services",
            "summary": "",
            "visible": true
            }
        ],
        "columns": 1,
        "visible": true,
        "separateLinks": true
        }
    }
    }
    ```
    """

    try:
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=4096,
            seed=314,
            temperature=0.1,
            stream=True,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": markdown_txt}
            ]
        )

        # Initialize an empty string to collect the streamed response
        collected_response = ""
        for chunk in response:
            collected_response += chunk.choices[0].delta.content
            print(chunk.choices[0].delta.content, end="", flush=True)
        
        # Return the complete collected response
        return collected_response
    
    except Exception as e:
        print(f"Error converting Markdown to JSON: {e}")
        return ""


markdown_txt = r"""
#Ananya Singh Contact: +91 8822910379 Social: Instagram | LinkedIn | Gmail | Portfolio ## Profile Summary I am a UI/UX Designer with a deep sense of user needs, crafting user experiences that blend form with function. I am exploring opportunities to collaborate on developing top-tier digital products with businesses. ## Education - Bachelor of Design (Interaction Design) JK Lakshmipat University, Jaipur CGPA: 8.1 2022-2026 - Google UX Certificate Course Coursera Grade: 95% May-Jul 2023 - Higher Secondary School (Science: PCM) The Assam Valley School ICSE: 98.4%, ISC: 98.4% overall 2015-2021 ## Work Experience - UX Design Intern Brandbakerz Sep 2023 - May 2024 - Designing the UX and interface of a habit-building educational and entertainment app for children from inception, collaborating closely with a team of designers and a product lead. - UX Design Intern (Sole Designer and Lead) Janki Jewellery Feb 2024 - Mar 2024 - Redesigned the online e-commerce website for Janki, a jewelry brand, reimagining its brand identity and strategic planning, while also actively incorporating content creation. - UX Design Intern HDFC Bank May 2024 - Jul 2024 - Involved in designing two major digital banking products, aiming to enhance user experience and operational efficiency. Leveraging skills in user research, wireframing, and prototyping to craft solutions aimed at driving innovation in the fintech domain. - User Experience Specialist Intern Ohilo Games Jun 2024 - Jul 2024 - Led the design for two motion-based mobile games, enhancing UX flows, branding, and UI design, as well as benchmarking and competitor analysis studies. Collaborated closely with developers, product managers, and artists to ensure cohesive and engaging gameplay experiences. - Freelance UI/UX Designer Decorise and CandleCraftCo. May 2024 - Present - Designed Shopify-based websites with branding and graphics for individual freelance projects, including Decorise, a home decor company, and CandleCraftCo., a handmade candle business. ## Skills - User Research - Wireframing - Prototyping - UX/UI Design ## Tools & Technologies - Figma - Adobe XD - Illustrator - Photoshop - Framer - Touch Designer - Procreate - Traditional Art Mediums ## Certifications - Google UX Certificate Course (Coursera) - 95% Grade ## Additional Information - Available for freelance projects and collaborations. # Ananya Singh Contact: +91 8822910379 Social: Instagram | LinkedIn | Gmail | Portfolio ## Profile Summary I am a UI/UX Designer with a deep sense of user needs, crafting user experiences that blend form with function. I am exploring opportunities to collaborate on developing top-tier digital products with businesses. ## Education - Bachelor of Design (Interaction Design) JK Lakshmipat University, Jaipur CGPA: 8.1 2022-2026 - Google UX Certificate Course Coursera Grade: 95% May-Jul 2023 - Higher Secondary School (Science: PCM) The Assam Valley School ICSE: 98.4%, ISC: 98.4% overall 2015-2021 ## Work Experience - UX Design Intern Brandbakerz Sep 2023 - May 2024 - Designing the UX and interface of a habit-building educational and entertainment app for children from inception, collaborating closely with a team of designers and a product lead. - UX Design Intern (Sole Designer and Lead) Janki Jewellery Feb 2024 - Mar 2024 - Redesigned the online e-commerce website for Janki, a jewelry brand, reimagining its brand identity and strategic planning, while also actively incorporating content creation. - UX Design Intern HDFC Bank May 2024 - Jul 2024 - Involved in designing two major digital banking products, aiming to enhance user experience and operational efficiency. Leveraging skills in user research, wireframing, and prototyping to craft solutions aimed at driving innovation in the fintech domain. - User Experience Specialist Intern Ohilo Games Jun 2024 - Jul 2024 - Led the design for two motion-based mobile games, enhancing UX flows, branding, and UI design, as well as benchmarking and competitor analysis studies. Collaborated closely with developers, product managers, and artists to ensure cohesive and engaging gameplay experiences. - Freelance UI/UX Designer Decorise and CandleCraftCo. May 2024 - Present - Designed Shopify-based websites with branding and graphics for individual freelance projects, including Decorise, a home decor company, and CandleCraftCo., a handmade candle business. ## Skills - User Research - Wireframing - Prototyping - UX/UI Design ## Tools & Technologies - Figma - Adobe XD - Illustrator - Photoshop - Framer - Touch Designer - Procreate - Traditional Art Mediums ## Certifications - Google UX Certificate Course (Coursera) - 95% Grade ## Additional Information - Available for freelance projects and collaborations.
"""

json_txt = Markdown2JsonTool(markdown_txt)

print(json_txt)